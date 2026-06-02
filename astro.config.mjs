// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

function remarkGithubAlerts() {
	return (tree) => {
		function walk(node) {
			if (node.type === 'blockquote') {
				const firstChild = node.children?.[0];
				if (firstChild && firstChild.type === 'paragraph') {
					const firstTextNode = firstChild.children?.[0];
					if (firstTextNode && firstTextNode.type === 'text') {
						const text = firstTextNode.value;
						const match = text.match(/^\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*(?:\r?\n)?/i);
						if (match) {
							const type = match[1].toLowerCase();
							firstTextNode.value = text.slice(match[0].length);
							
							node.data = node.data || {};
							node.data.hProperties = node.data.hProperties || {};
							node.data.hProperties.class = `alert-box alert-${type}`;
							node.data.hProperties.className = ['alert-box', `alert-${type}`];
						}
					}
				}
			}
			if (node.children) {
				node.children.forEach(walk);
			}
		}
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://nealmcspadden.com',
	markdown: {
		remarkPlugins: [remarkGithubAlerts],
	},
	integrations: [
		mdx({
			remarkPlugins: [remarkGithubAlerts],
		}),
		sitemap({
			filter: (page) => !page.includes('/secret-route') && !page.includes('/success'),
			serialize: (item) => {
				if (item.url === 'https://nealmcspadden.com' || item.url === 'https://nealmcspadden.com/') {
					item.changefreq = 'weekly';
					item.priority = 1.0;
				} else if (/\/frameworks\/.+/.test(item.url)) {
					item.changefreq = 'monthly';
					item.priority = 0.9;
				} else if (/\/media\/.+/.test(item.url) || /\/thinking\/.+/.test(item.url)) {
					item.changefreq = 'monthly';
					item.priority = 0.8;
				} else if (item.url.includes('/portfolio') || item.url.includes('/about')) {
					item.changefreq = 'monthly';
					item.priority = 0.7;
				}
				return item;
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
