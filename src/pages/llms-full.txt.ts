import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const blog = await getCollection('blog');
	const appearances = await getCollection('appearances');

	// Sort collections by date descending
	const sortedBlog = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	const sortedAppearances = appearances.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	let totalContext = `# Neal McSpadden - Complete Content Manifest\n\n`;
	totalContext += `This file contains the complete raw text of all essays, frameworks summaries, and media appearance transcripts for nealmcspadden.com. It is optimized for direct RAG (Retrieval-Augmented Generation) ingest by AI agents.\n\n`;

	totalContext += `========================================================================\n`;
	totalContext += `PART 1: THINKING & ESSAYS\n`;
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
