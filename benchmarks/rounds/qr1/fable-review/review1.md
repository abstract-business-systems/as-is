REVIEW 1 OF 3 — scope: protocol-level soundness of the draft "Candidate C design-first dynamic-component benchmark protocol" (c-dfdc-1.0.0-draft.1). Focus on:
1. Internal consistency: budget arithmetic and inclusion rules; child/retry accounting; matched-triplet and replacement-schedule mechanics (is the randomization schedule sufficient for the stated reserve?); stopping rules; aggregation and decision rules.
2. Statistical and decision-rule soundness: are the primary (B vs C) and secondary (current vs C) decision rules coherent, non-circular, interpretable? Is "approaches current" well defined? Are hard failures operationally defined wherever they are decisive?
3. Validity taxonomy: infrastructure invalidity vs scored arm failure vs safety/stage-stop; correct boundaries and consistent rerun rules?
4. Temporal design-before-implementation evidence: is "adequacy" operationally defined?
5. Fairness between arms, especially current-arm admission input.
Deliver: numbered blocking findings (each with section reference and a concrete required resolution), advisory findings, and a bounded verdict on readiness for (a) Gate H1 (fixture prep + provider-free pilot authorization) and (b) Gate H2 (scored preregistration).

Keep the final review under 3500 words: findings first, concise. If you risk running out of budget, cut advisory detail, never blocking findings or the final verdict.
