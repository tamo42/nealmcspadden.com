import { getCollection } from 'astro:content';
import conceptsMetadataRaw from '../data/concepts-metadata.json';

// Type definitions
export interface ConceptMeta {
	label: string;
	category: string;
	description: string;
	related: string[];
}

export interface PostReference {
	title: string;
	url: string;
	snippet: string;
	type: 'blog' | 'appearance';
	date: Date;
}

export interface OntologyNode {
	id: string;
	label: string;
	category: string;
	description: string;
	posts: PostReference[];
	weight: number; // based on post count
}

export interface OntologyLink {
	source: string;
	target: string;
	type: string;
}

export interface OntologyData {
	nodes: OntologyNode[];
	links: OntologyLink[];
}

const conceptsMetadata = conceptsMetadataRaw as Record<string, ConceptMeta>;

// Normalizes concept names to match keys in metadata
export function toSlug(name: string): string {
	const slug = name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	
	// Concept alias mapping to centralize mappings
	if (slug.includes('augusta')) return 'augusta-rule';
	if (slug === 's-corp' || slug === 's-corp-structure') return 's-corp-structure';
	if (slug === 'qbi' || slug === 'qbi-deduction') return 'qbi-deduction';
	if (slug === 'bookkeeping' || slug === 'clean-bookkeeping') return 'clean-bookkeeping';
	if (slug === 'ledger' || slug === 'ledger-of-truth') return 'ledger-of-truth';
	if (slug === 'context-layer' || slug === 'the-context-layer') return 'context-layer';
	if (slug === 'clearpath' || slug === 'clearpath-framework') return 'clearpath-framework';
	if (slug === 'builders-and-narrators' || slug === 'builders-vs-narrators' || slug === 'builders-narrators') return 'builders-narrators';
	if (slug === 'partnership' || slug === 'partnership-risk') return 'partnership-risk';
	if (slug === 'unvoiced-values') return 'unvoiced-values';
	if (slug === 'metabolic-horizon') return 'metabolic-horizon';
	if (slug === 'permaculture' || slug === 'permaculture-farming') return 'permaculture-farming';
	if (slug === 'private-equity' || slug === 'private-equity-dynamics') return 'private-equity';
	
	return slug;
}

export async function getOntology(): Promise<OntologyData> {
	const blog = await getCollection('blog');
	const appearances = await getCollection('appearances');

	const nodeMap = new Map<string, OntologyNode>();

	// Helper to add a post reference to a node
	const addReference = (conceptName: string, snippet: string, ref: PostReference) => {
		const slug = toSlug(conceptName);
		
		// Get metadata or create fallback
		let meta = conceptsMetadata[slug];
		if (!meta) {
			console.warn(`[Ontology Warning] Concept "${conceptName}" (slug: "${slug}") has no entry in concepts-metadata.json. Creating fallback.`);
			meta = {
				label: conceptName,
				category: 'uncategorized',
				description: `Discussions and writings regarding ${conceptName}.`,
				related: []
			};
		}

		if (!nodeMap.has(slug)) {
			nodeMap.set(slug, {
				id: slug,
				label: meta.label,
				category: meta.category,
				description: meta.description,
				posts: [],
				weight: 0
			});
		}

		const node = nodeMap.get(slug)!;
		node.posts.push({
			...ref,
			snippet: snippet || ref.snippet
		});
		node.weight = node.posts.length;
	};

	// 1. Process Blog collection
	blog.forEach(post => {
		if (post.data.semanticConcepts && Array.isArray(post.data.semanticConcepts)) {
			post.data.semanticConcepts.forEach(concept => {
				addReference(concept.name, concept.snippet, {
					title: post.data.title,
					url: `/thinking/${post.id}/`,
					snippet: concept.snippet,
					type: 'blog',
					date: post.data.pubDate
				});
			});
		}
	});

	// 2. Process Appearances collection
	appearances.forEach(item => {
		if (item.data.semanticConcepts && Array.isArray(item.data.semanticConcepts)) {
			item.data.semanticConcepts.forEach(concept => {
				addReference(concept.name, concept.snippet, {
					title: item.data.title,
					url: `/media/${item.id}/`,
					snippet: concept.snippet,
					type: 'appearance',
					date: item.data.pubDate
				});
			});
		}
	});

	// 3. Process any static frameworks mentioned in metadata but not explicitly dynamically tagged
	// Add manual fallback logic for frameworks (like clearpath or partnership-blueprint) if they exist
	// In the future, we could also load static framework pages, but for now we manually add references
	// for concepts that are central to the registry.
	const nodes = Array.from(nodeMap.values());

	// Sort posts within nodes by date descending
	nodes.forEach(node => {
		node.posts.sort((a, b) => b.date.getTime() - a.date.getTime());
	});

	// 4. Generate Links between nodes
	const links: OntologyLink[] = [];
	const seenLinks = new Set<string>();

	nodes.forEach(node => {
		const meta = conceptsMetadata[node.id];
		if (meta && meta.related) {
			meta.related.forEach(relatedId => {
				// Only link if the target node exists in our compiled set
				if (nodeMap.has(relatedId)) {
					const linkKey = [node.id, relatedId].sort().join('=>');
					if (!seenLinks.has(linkKey)) {
						seenLinks.add(linkKey);
						links.push({
							source: node.id,
							target: relatedId,
							type: 'related'
						});
					}
				}
			});
		}
	});

	return { nodes, links };
}

// Generates Schema.org JSON-LD graph block for SEO/AEO
export function generateOntologyJsonLd(nodes: OntologyNode[], siteUrl: string): string {
	const graph = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "DefinedTermSet",
				"@id": `${siteUrl}/navigator/#ontology`,
				"name": "Neal McSpadden Semantic Ontology Map",
				"description": "Ontology mapping concepts of tax planning, business systems, and personal leverage.",
				"hasDefinedTerm": nodes.map(node => ({
					"@type": "DefinedTerm",
					"@id": `${siteUrl}/navigator/#${node.id}`,
					"name": node.label,
					"description": node.description,
					"url": `${siteUrl}/navigator/?focus=${node.id}`,
					"subjectOf": node.posts.map(post => ({
						"@type": post.type === 'blog' ? "BlogPosting" : "CreativeWork",
						"name": post.title,
						"url": `${siteUrl}${post.url}`
					}))
				}))
			}
		]
	};

	return JSON.stringify(graph, null, 2);
}
