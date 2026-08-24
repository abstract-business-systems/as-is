# Draft-36 manifest verification

This is a durable, advisory caller-side verification observation for the planned target-design package. It is not package approval, human alignment, task authority, or implementation authorization.

- **Package revision:** `target-design-v1-draft-36`
- **Manifest:** `drafts/agentic-development-system-target-design-draft36/review-manifest.md`
- **Verified file set:** the eight non-manifest files listed in that manifest; the manifest itself was inspected directly and is excluded from its digest table.
- **Verifier:** present orchestration session, using local SHA-256 computation.
- **Method:** recompute `sha256(file bytes)` for every manifest-listed non-manifest path and compare exact lowercase hexadecimal values; recompute packet digest as SHA-256 over each manifest-defined repository-relative path in manifest order, followed by `NUL` and exact file bytes, including the manifest.
- **Result:** all eight non-manifest digest entries matched.
- **Packet digest:** `5c4e4726c80f41765147e4f7e21f5ffe86dea845a8ea384bdbfeb31d0e601e0f`
- **Verification time:** 2026-08-24 session; exact UTC timestamp is not asserted in this Markdown record.

This observation verifies the exact draft-36 bytes from the caller worktree. It does not prove that any reviewer independently received or hashed the same bytes. Any package edit requires a new revision and a new verification observation.
