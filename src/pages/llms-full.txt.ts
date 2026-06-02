import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

export const GET: APIRoute = async () => {
	const blog = await getCollection('blog');
	const appearances = await getCollection('appearances');

	// Sort collections by date descending
	const sortedBlog = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	const sortedAppearances = appearances.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	let aboutMarkdown = '';
	try {
		const aboutPath = path.join(process.cwd(), 'src/pages/about.astro');
		const aboutContent = await fs.readFile(aboutPath, 'utf-8');

		const layoutMatch = aboutContent.match(/<Layout[\s\S]*?>([\s\S]*?)<\/Layout>/);
		if (layoutMatch) {
			let parsed = layoutMatch[1];
			// Strip styles and scripts
			parsed = parsed.replace(/<style>[\s\S]*?<\/style>/gi, '');
			parsed = parsed.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
			parsed = parsed.replace(/<!--[\s\S]*?-->/g, '');

			// Headings
			parsed = parsed.replace(/<h2[\s\S]*?>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
			parsed = parsed.replace(/<h3[\s\S]*?>([\s\S]*?)<\/h3>/gi, '### $1\n\n');

			// Answer Capsules -> blockquotes
			parsed = parsed.replace(/<div class="answer-capsule">([\s\S]*?)<\/div>/gi, (match, p1) => {
				const cleaned = p1.replace(/<p[\s\S]*?>([\s\S]*?)<\/p>/gi, '$1').trim();
				return `> ${cleaned}\n\n`;
			});

			// Paragraphs
			parsed = parsed.replace(/<p[\s\S]*?>([\s\S]*?)<\/p>/gi, '$1\n\n');

			// Lists
			parsed = parsed.replace(/<ul[\s\S]*?>([\s\S]*?)<\/ul>/gi, '$1\n');
			parsed = parsed.replace(/<li[\s\S]*?>([\s\S]*?)<\/li>/gi, '- $1\n');

			// Inline formatting
			parsed = parsed.replace(/<strong[\s\S]*?>([\s\S]*?)<\/strong>/gi, '**$1**');
			parsed = parsed.replace(/<em[\s\S]*?>([\s\S]*?)<\/em>/gi, '*$1*');
			parsed = parsed.replace(/<a\s+href="([^"]+)"[\s\S]*?>([\s\S]*?)<\/a>/gi, '[$2]($1)');

			// Strip any remaining html tags
			parsed = parsed.replace(/<[^>]+>/g, '');

			// Decode HTML entities
			parsed = parsed
				.replace(/&rsquo;/g, "'")
				.replace(/&lsquo;/g, "'")
				.replace(/&ldquo;/g, '"')
				.replace(/&rdquo;/g, '"')
				.replace(/&amp;/g, '&')
				.replace(/&nbsp;/g, ' ');

			aboutMarkdown = parsed.trim().replace(/\n{3,}/g, '\n\n');
		}
	} catch (e) {
		aboutMarkdown = 'Error parsing About page content.';
	}

	let totalContext = `# Neal McSpadden - Complete Content Manifest\n\n`;
	totalContext += `This file contains the complete raw text of all essays, frameworks summaries, and media appearance transcripts for nealmcspadden.com. It is optimized for direct RAG (Retrieval-Augmented Generation) ingest by AI agents.\n\n`;

	totalContext += `========================================================================\n`;
	totalContext += `PART 1: IDENTITY, BIOGRAPHY & PORTFOLIO\n`;
	totalContext += `========================================================================\n\n`;
	totalContext += `URL: https://nealmcspadden.com/about/\n\n`;
	totalContext += `${aboutMarkdown}\n\n`;

	totalContext += `========================================================================\n`;
	totalContext += `PART 2: THINKING & ESSAYS\n`;
	totalContext += `========================================================================\n\n`;

	for (const post of sortedBlog) {
		totalContext += `--- \n\n`;
		totalContext += `## Title: ${post.data.title}\n`;
		totalContext += `URL: https://nealmcspadden.com/thinking/${post.id}/\n`;
		totalContext += `Published: ${post.data.pubDate.toDateString()}\n`;
		totalContext += `Description: ${post.data.description}\n\n`;
		totalContext += `### Content:\n`;
		
		let body = post.body || '';
		body = body.replace(/<div id="raw-transcript">/gi, '').replace(/<\/div>/gi, '');
		totalContext += `${body.trim()}\n\n`;
	}

	totalContext += `========================================================================\n`;
	totalContext += `PART 2: MEDIA APPEARANCES & TRANSCRIPTS\n`;
	totalContext += `========================================================================\n\n`;

	for (const item of sortedAppearances) {
		totalContext += `--- \n\n`;
		totalContext += `## Title: ${item.data.title}\n`;
		totalContext += `URL: https://nealmcspadden.com/media/${item.id}/\n`;
		totalContext += `Published: ${item.data.pubDate.toDateString()}\n`;
		totalContext += `Host: ${item.data.host}\n`;
		totalContext += `Original External URL: ${item.data.url}\n`;
		totalContext += `Description: ${item.data.description}\n\n`;
		totalContext += `### Content:\n`;

		let body = item.body || '';
		body = body.replace(/<div id="raw-transcript">/gi, '').replace(/<\/div>/gi, '');
		totalContext += `${body.trim()}\n\n`;
	}

	return new Response(totalContext, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
