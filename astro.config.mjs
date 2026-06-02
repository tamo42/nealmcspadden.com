// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://nealmcspadden.com',
	integrations: [
		mdx(),
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
