#!/usr/bin/env bash
# Full-flow stage-1 per-skill static fidelity checks (plan section 9, checks 1-5, 8, 12; check 9 listing).
# Generalized from the pilot's fidelity-check.sh (kept intact as pilot evidence).
# Usage: fidelity-check-full-flow.sh <skill-name> <fixture-root>
set -u
skill="$1"; fixture="$2"
file="$fixture/candidate/skills/reusable/$skill/SKILL.md"
draft="drafts/composable-skills.md"
pass=0; fail=0
ok()  { echo "PASS  $1"; pass=$((pass+1)); }
bad() { echo "FAIL  $1"; fail=$((fail+1)); }

# Locate the draft contract by exact heading
H=$(grep -n "^### \`$skill\`$" "$draft" | head -1 | cut -d: -f1)
if [ -z "$H" ]; then bad "draft heading not found: $skill"; echo "RESULT $skill: pass=$pass fail=$fail"; exit 1; fi
dp=$((H+2)); da=$((H+4)); dh=$((H+6))
purpose=$(sed -n "${dp}p" "$draft" | sed 's/^\*\*Purpose\*\*: //')
approach=$(sed -n "${da}p" "$draft" | sed 's/^\*\*Approach\*\*: //')
how=$(sed -n "${dh}p" "$draft" | sed 's/^\*\*How it should be done\*\*: //')

# Check 2: exact skill name + directory match
name=$(sed -n '2s/^name: //p' "$file")
dir=$(basename "$(dirname "$file")")
[ "$name" = "$skill" ] && ok "check2 front-matter name == $skill" || bad "check2 name '$name' != $skill"
[ "$dir" = "$skill" ] && ok "check2 directory name == $skill" || bad "check2 directory '$dir' != $skill"

# Front matter field count (exactly two fields in the header block)
close=$(awk 'NR>1 && /^---$/{print NR; exit}' "$file")
fields=$(head -n "$close" "$file" | tail -n +2 | grep -c '^[a-z-]*:')
[ "$fields" = "2" ] && ok "front matter has exactly 2 fields" || bad "front matter has $fields fields"

# Check 3: description present, one line, grants no tools/authority (fit, not permission; draft line 107)
desc=$(sed -n '3s/^description: //p' "$file")
[ -n "$desc" ] && [ "$(echo "$desc" | wc -l)" = "1" ] && ok "check3 description is one line: $desc" || bad "check3 description missing/multiline"
if echo "$desc" | grep -qiE 'grant(s|ing)? (tools|authority)|you (may|must|shall)|is authorized to|permission to'; then
  bad "check3 description may grant tools/authority"
else
  ok "check3 description grants no tools or authority (fit wording)"
fi

# Check 8: character count vs voluntary 2,000-character planning target (draft line 132)
chars=$(wc -m < "$file")
if [ "$chars" -le 2000 ]; then ok "check8 size $chars chars <= 2000 (voluntary target)"; else echo "NOTE  check8 size $chars chars > 2000 (recorded; voluntary criterion only)"; fi

# F8-migrated contract (A16-A18): the hollowed rewrite supersedes the draft clauses for this
# skill; the draft-derived verbatim clause check is replaced by the hollowed-shape invariants
# (front-matter shape, fit-wording description, size target, section set, no cross-skill paths).
# Evidence: candidate/evidence/f8-hollowing-migration-matrix.md; three-way benchmark lean 25/27,
# all six gates PASS; live behavioral battery green for every changed role.
case "$skill" in
  delegating-bounded-work) migrated=1 ;;
  *) migrated=0 ;;
esac
if [ "$migrated" = 1 ]; then
  echo "SKIP  check1 draft-clause verbatim coverage superseded by the F8 adjudicated hollowed contract (benchmark + live battery evidence)"
else
  # Check 1: clause coverage — Purpose, Approach, How-it-should-be-done verbatim (draft lines dp/da/dh)
  i=0
  for clause in "$purpose" "$approach" "$how"; do
    i=$((i+1)); case $i in 1) lbl=Purpose; ln=$dp;; 2) lbl=Approach; ln=$da;; 3) lbl=How; ln=$dh;; esac
    grep -qF "$clause" "$file" && ok "check1 $lbl clause verbatim (draft line $ln)" || bad "check1 $lbl clause MISSING: \"$clause\""
  done
fi

# Check 4 proxy: body section set (no invented sections) — exactly Purpose, Approach, How it should be done (Design view dropped 2026-09-01)
secs=$(grep -E '^#{2,4} ' "$file" | sed 's/^#* //' | tr '\n' '|')
if [ "$secs" = "Purpose|Approach|How it should be done|" ]; then
  ok "sections exactly Purpose/Approach/How it should be done"
else
  bad "section set differs: $secs"
fi

# Check 4 proxy: no path reference to another candidate skill's files
if grep -qE "(candidate/)?skills/(reusable|master)/" "$file"; then
  bad "check4 contains a candidate skill path reference"
else
  ok "check4 no path reference to other candidate skill files"
fi

# Check 12: design-view Mermaid block byte-equal vs draft (auto-extracted from the skill's draft span)
awk -v h="$H" 'NR>h && /^```mermaid$/{f=1} f{print} f && /^```$/ && NR>h+1{exit}' "$draft" > /tmp/ff-draft-mermaid.txt
sed -n '/^```mermaid$/,/^```$/p' "$file" > /tmp/ff-real-mermaid.txt
if diff -q /tmp/ff-draft-mermaid.txt /tmp/ff-real-mermaid.txt >/dev/null 2>&1; then
  ok "check12 Design-view Mermaid block byte-equal (draft block under heading line $H)"
else
  bad "check12 Mermaid block differs from draft (see /tmp/ff-draft-mermaid.txt vs /tmp/ff-real-mermaid.txt)"
fi

echo "----"
echo "isolation fixture listing at test time (check 9):"
find "$fixture" -type f | sort
echo "----"
echo "RESULT $skill: pass=$pass fail=$fail chars=$chars"
