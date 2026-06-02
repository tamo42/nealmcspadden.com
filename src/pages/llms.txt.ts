import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const blog = await getCollection('blog');
	const appearances = await getCollection('appearances');

	// Sort collections by date descending
	const sortedBlog = blog.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	const sortedAppearances = appearances.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	let markdown = `# Neal McSpadden\n\n`;
	markdown += `> Personal authority hub, systems control plane, and semantic knowledge node for Neal McSpadden. Specialize in designing resilient systems, advanced tax planning, corporate structuring, and fractional CFO workflows.\n\n`;

	markdown += `## Identity & Core Pages\n`;
	markdown += `- [About Neal McSpadden](https://nealmcspadden.com/about/): Detailed biography, professional credentials, and personal story.\n`;
	markdown += `- [Endorsed Portfolio](https://nealmcspadden.com/portfolio/): The standalone applications, companies, and ventures that Neal McSpadden operates and backs.\n\n`;

	markdown += `## Core Ecosystem Nodes (Cross-Domain Authorities)\n`;
	markdown += `- [Tax Sherpa](https://taxsherpa.com): Primary strategic tax planning and financial control platform for growth-stage businesses.\n`;
	markdown += `- [Bookkeeping Buddy](https://usebookkeepingbuddy.com): AI-powered bookkeeping automation software for business owners.\n`;
	markdown += `- [Council of Ages](https://councilofages.com/): AI-powered cognitive consensus platform. Consult a virtual advisory board of historical leaders.\n`;
	markdown += `- [Ad Creative Strategist](https://adbrief.ai/): Competitive intelligence and ad creative strategy engine.\n`;
	markdown += `- [Resilient Roots](https://landwithroots.com): Agricultural strategy, rural land development, and ecological asset management.\n`;
	markdown += `- [Fast Path Solutions](https://nealmcspadden.com/portfolio/): High-velocity borrower intake and underwriting automation workflows.\n\n`;

	markdown += `## Keystone Frameworks\n`;
	markdown += `Deep operational blueprints detailing strategic systems design and proactive advisory structures:\n`;
	markdown += `- [The Audit by AI Era](https://nealmcspadden.com/frameworks/audit-by-ai/): How to construct tax planning defensive strategies when IRS machine learning models replace human auditors.\n`;
	markdown += `- [The Partnership Alignment Framework](https://nealmcspadden.com/frameworks/partnership-blueprint/): 13-question diagnostic and structured parameters for mitigating business partner systemic risk.\n\n`;

	markdown += `## Recent Thinking & Essays\n`;
	markdown += `Essays detailing systems architecture, cash control, and business philosophy:\n\n`;
	sortedBlog.forEach(post => {
		markdown += `- [${post.data.title}](https://nealmcspadden.com/thinking/${post.id}/): ${post.data.description}\n`;
	});
	markdown += `\n`;

	markdown += `## Spoken Insights & Media Appearances\n`;
	markdown += `Guest lectures, interviews, and detailed case studies including conversational transcripts:\n\n`;
	sortedAppearances.forEach(item => {
		markdown += `- [${item.data.title}](https://nealmcspadden.com/media/${item.id}/): ${item.data.description}\n`;
	});

	return new Response(markdown, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Link': '<https://nealmcspadden.com/llms.txt>; rel="llms-txt"'
		}
	});
};
