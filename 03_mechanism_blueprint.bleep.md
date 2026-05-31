# ICM MECHANISM BLUEPRINT - NEAL MCSPADDEN PERSONAL CONTROL PLANE

<LEAP_INSTRUCTION_SET>

  <META>
    <ID>nm_blog_mechanism_blueprint.bleep</ID>
    <PURPOSE>To define the workflow for drafting, migrating, and deploying content via the Antigravity pipeline.</PURPOSE>
  </META>

  <TAB_5_STATE_MACHINE>
    <STATE_MAP>
      - CURRENT_STATE: STATE_01_IDEATION
      - TRANSITION_PATHS:
          STATE_01_IDEATION -> STATE_02_REFINEMENT
          STATE_02_REFINEMENT -> STATE_03_DEPLOYMENT
    </STATE_MAP>

    <STATE_01_IDEATION>
      <INSTRUCTIONS>
        1. User records raw voice memos or "Reverse Interviews" detailing real-world insights, failures, and lessons.
        2. AI acts as a transcriber and formatter to structure the thoughts into initial Markdown drafts.
        3. Initial drafts and rough notes are stored in `neal-os/02-workbench/00-Personal/nhq-blog-drafting/`.
      </INSTRUCTIONS>
      <TRANSITION_CRITERIA>Initial AI-formatted draft is ready for human polish.</TRANSITION_CRITERIA>
    </STATE_01_IDEATION>

    <STATE_02_REFINEMENT>
      <INSTRUCTIONS>
        1. User performs a strict Human Polish in `neal-os/02-workbench/00-Personal/nhq-blog-drafting/` to ensure authenticity and "Flaws Forward" framing.
        2. Antigravity transfers the finalized Markdown file to `nealmcspadden.com/src/content/blog/`.
        3. Ensure frontmatter contains valid parameters (`title`, `description`, `pubDate`, `heroImage`).
        4. Validate that facts are front-loaded and structured data (including speakable schema) is supported.
      </INSTRUCTIONS>
      <TRANSITION_CRITERIA>File is fully polished, present, and valid in the Astro content collection.</TRANSITION_CRITERIA>
    </STATE_02_REFINEMENT>

    <STATE_03_DEPLOYMENT>
      <INSTRUCTIONS>
        1. Stage changes in git.
        2. Commit changes using `git commit -m "Publish: [Title]"`.
        3. Push to GitHub, which will trigger the Railway build automatically.
      </INSTRUCTIONS>
      <TRANSITION_CRITERIA>Git push succeeds; Railway build initiates.</TRANSITION_CRITERIA>
    </STATE_03_DEPLOYMENT>
  </TAB_5_STATE_MACHINE>

</LEAP_INSTRUCTION_SET>
