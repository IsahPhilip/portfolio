# Build notes

## Reference inspection

Reference: https://nuance-portfolio.framer.website/

Inspected before implementation at desktop (1440px) and mobile (390px): homepage, Works, About, and the complete FlowPay case study. Local captured evidence lives in `artifacts/reference-*.png` and `artifacts/reference-inspection.json` (excluded from Git).

Content flow observed from the reference: introduction → services → selected project switching → expertise → contact. Works uses image-led cards; About pairs a profile introduction with capabilities; case studies lead with context and project metadata before a long illustrated narrative and related work.

Original direction for this implementation: navy/white editorial composition, restrained teal, original connected-node graphics, systems-focused copy, and compact technical diagrams. Do not reuse the reference's photography, client claims, statistics, or testimonials.

Desktop observations: a segmented header, a profile-led hero, service cards, a project selector, two-column Works cards, and a case-study article with a left contents rail, contextual images, and related work. Mobile observations: collapsed menu, stacked content, and a full-width narrative. The reference’s scroll/reveal behavior was unstable in automation, and several mobile elements stayed hidden with reduced motion; our implementation keeps content visible by default and enhances navigation with browser JavaScript.

The reference homepage project selector was attempted at both widths; it stayed unstable during the automated click. Its project destinations and content flow were inspected directly. Reference contact forms were not submitted.
