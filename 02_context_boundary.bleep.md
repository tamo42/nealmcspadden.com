# ICM CONTEXT BOUNDARY - NEAL MCSPADDEN PERSONAL CONTROL PLANE

<LEAP_INSTRUCTION_SET>

  <META>
    <ID>nm_blog_context_boundary.bleep</ID>
    <PURPOSE>To define the sandbox environment, tech stack limitations, and working directory boundaries for the blog's code and content.</PURPOSE>
  </META>

  <TAB_3_INPUT_BOUNDARY>
    <TECH_STACK_SPECIFICATIONS>
      - Core framework: Astro (for zero-JS by default).
      - Styling: Tailwind CSS.
      - Content Format: Markdown / MDX.
      - Hosting/Deployment: Railway (via GitHub webhook).
      - Domain: nealmcspadden.com
    </TECH_STACK_SPECIFICATIONS>

    <DATA_PROFILE_CONSTRAINTS>
      - AVOID CLIENT DATA: This repository is public-facing. Do not move or reference restricted entity data, client PII, or internal financials here.
      - SOURCE OF TRUTH: All published content lives in `src/content/blog/`.
      - DRAFT ORIGIN: Drafts originate in `neal-os/02-workbench/00-Personal/` and are copied here only when ready for deployment.
    </DATA_PROFILE_CONSTRAINTS>

    <WORKSPACE_MAPPING>
      - LAYER 0 (Identity): GEMINI.md (to be synced from neal-os if applicable).
      - LAYER 1 (Framework): Astro framework files (`astro.config.mjs`, `tailwind.config.mjs`).
      - LAYER 2 (Content): `src/content/blog/`.
      - LAYER 3 (Rules): The 4 BLEEP architecture files stored in the root.
    </WORKSPACE_MAPPING>
  </TAB_3_INPUT_BOUNDARY>

  <TAB_4_SYSTEM_AUDITOR>
    <QUALITY_ASSURANCE_GYROSCOPE>
      - NO HIGHLEVEL PAGE BUILDERS: Any CRM integration (e.g., newsletter signup) must be an embedded iframe or custom API call; never redirect to a slow GHL landing page.
      - IMAGE OPTIMIZATION: All static assets must use Astro's native `<Image />` component for optimal AEO formatting.
      - SCHEMA COMPLIANCE: Every page layout and unique page template must include structured JSON-LD schema (e.g., WebSite, Person, WebPage, BlogPosting, or CollectionPage) with a speakable configuration to maximize discoverability for AEO and search crawlers.
    </QUALITY_ASSURANCE_GYROSCOPE>
  </TAB_4_SYSTEM_AUDITOR>

</LEAP_INSTRUCTION_SET>
