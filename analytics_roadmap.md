# Roadmap: Self-Hosted Analytics Integration (Umami + Railway)

This roadmap outlines the recommended tools, architecture, and step-by-step implementation plan for deploying a lightweight, privacy-focused, self-hosted analytics solution on [nealmcspadden.com](https://nealmcspadden.com) using **Umami** hosted on **Railway**.

---

## 1. Selected Stack & Rationale

We recommend a self-hosted analytics stack optimized for absolute zero client-side bloat, cookie-free tracking (no cookie banners), and developer independence:

```
                            +---------------------------------+
                            |       Your Railway Account      |
                            +---------------------------------+
                            |                                 |
                            |  +---------------------------+  |
                            |  |     nealmcspadden.com     |  |
                            |  |       (Astro Static)      |  |
                            |  +---------------------------+  |
                            |                |                |
                            |                v (2KB Script)   |
                            |  +---------------------------+  |
                            |  |     Umami Application     |  |
                            |  |      (Node Container)     |  |
                            |  +---------------------------+  |
                            |                |                |
                            |                v                |
                            |  +---------------------------+  |
                            |  |    PostgreSQL Database    |  |
                            |  |        (State Store)      |  |
                            |  +---------------------------+  |
                            +---------------------------------+
```

### Core Tools
*   **Umami Analytics**: A self-hosted, open-source alternative to Google Analytics. It does not use cookies, does not collect personally identifiable information (PII), and gathers metrics anonymously. The client script is **under 2 KB**, causing zero performance impact.
*   **Railway Hosting**: Since your main site is already on Railway, we deploy the Umami dashboard and its PostgreSQL database as a secondary service on the same account using Railway's 1-click template.
*   **Google Search Console (GSC)**: Essential for search indexing telemetry and monitoring how search bots and AI answer engines parse your content. (Configured separately via DNS verification).

---

## 2. Step-by-Step Deployment Roadmap

### Phase 1: Deploy Umami on Railway
1.  Log in to your **Railway** dashboard.
2.  Click **New Project** &rarr; **Deploy from Template**.
3.  Search for **Umami** and select the template by **Brody's Projects** (this is the most popular/well-maintained template with 1,500+ deploys and a 100% success rate, which automatically provisions both the Umami Node.js container and a PostgreSQL database).
4.  Click **Deploy**. Railway will build the containers and assign a public URL (e.g., `https://umami-production-xxx.up.railway.app`).

### Phase 2: Setup the Website in Umami
1.  Navigate to your deployed Umami URL.
2.  Log in with the default credentials:
    *   **Username**: `admin`
    *   **Password**: `umami`
3.  *Security Check*: Immediately go to **Settings** &rarr; **Profile** and change the admin password.
4.  Go to **Settings** &rarr; **Websites** &rarr; **Add Website**.
5.  Enter `nealmcspadden.com` and save.
6.  Copy your unique **Website ID** (a UUID string).

### Phase 3: Integrate with Astro Codebase
We will bypass Google Tag Manager entirely and inject the Umami tracker directly into the HTML header of the site.

1.  Open [BaseHead.astro](file:///c:/Users/neal/nealmcspadden.com/src/components/BaseHead.astro).
2.  Append the tracking script at the end of the metadata block (wrapping it in a production-only check to prevent local development visits from polluting your stats):

```html
<!-- src/components/BaseHead.astro -->
...
<!-- Canonical URL -->
<link rel="canonical" href={canonicalURL} />

<!-- Self-Hosted Umami Analytics (Production Only) -->
{import.meta.env.PROD && (
  <script 
    async 
    defer 
    src="https://umami-production-26bd.up.railway.app/script.js" 
    data-website-id="5f6d65ed-aec6-4195-8133-04e853a0add3"
  ></script>
)}
```

---

## 3. Verification & SEO Setup

*   [x] **Test Locally**: Run `npm run build` to verify there are no compilation issues.
*   [ ] **Push and Deploy**: Commit the code changes and push to git (`git push`). Railway will automatically build and deploy.
*   [ ] **Verify Live Script**: Open the live site in your browser and inspect the source code to verify the Umami script is loaded.
*   [ ] **Verify GSC Verification**: Add the domain in Google Search Console using the TXT DNS record method to verify ownership without injecting heavy Google script tags.
