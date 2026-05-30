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
        1. User creates scratchpads and rough notes in `neal-os/02-workbench/00-Personal/`.
        2. Concepts are expanded upon during conversational planning.
      </INSTRUCTIONS>
      <TRANSITION_CRITERIA>Draft is fully formatted in Markdown and approved.</TRANSITION_CRITERIA>
    </STATE_01_IDEATION>

    <STATE_02_REFINEMENT>
      <INSTRUCTIONS>
        1. Antigravity transfers the finalized Markdown file from `neal-os` to `nealmcspadden.com/src/content/blog/`.
        2. Ensure frontmatter contains valid parameters (`title`, `description`, `pubDate`, `heroImage`).
      </INSTRUCTIONS>
      <TRANSITION_CRITERIA>File is present and valid in the Astro content collection.</TRANSITION_CRITERIA>
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
