#!/usr/bin/env bash
# Skill-fidelity pilot — static fidelity checks (plan section 6, checks 1-8, 12).
# Usage: fidelity-check.sh <skill-name> <fixture-root> <other-skill-name>
# Runs against an isolated fixture copy; never mutates the shared working tree.
set -u
skill="$1"; fixture="$2"; other="$3"
file="$fixture/candidate/skills/reusable/$skill/SKILL.md"
draft="drafts/composable-skills.md"
pass=0; fail=0
ok()   { echo "PASS  $1"; pass=$((pass+1)); }
bad()  { echo "FAIL  $1"; fail=$((fail+1)); }

# Check 2: exact skill name + directory match
name=$(sed -n '2s/^name: //p' "$file")
dir=$(basename "$(dirname "$file")")
[ "$name" = "$skill" ] && ok "check2 front-matter name == $skill" || bad "check2 name '$name' != $skill"
[ "$dir" = "$skill" ] && ok "check2 directory name == $skill" || bad "check2 directory '$dir' != $skill"

# Front matter field count (exactly two fields; header block only, lines 1..second ---)
fields=$(head -n "$(awk 'NR>1 && /^---$/{print NR; exit}' "$file")" "$file" | tail -n +2 | grep -c '^[a-z-]*:')
[ "$fields" = "2" ] && ok "front matter has exactly 2 fields" || bad "front matter has $fields fields"

# Check 3: description present, one line, grants no tools/authority
desc=$(sed -n '3s/^description: //p' "$file")
[ -n "$desc" ] && [ "$(echo "$desc" | wc -l)" = "1" ] && ok "check3 description is one line: $desc" || bad "check3 description missing/multiline"
if echo "$desc" | grep -qiE 'grant(s|ing)? (tools|authority)|you (may|must|shall)|is authorized to|permission to'; then
  bad "check3 description may grant tools/authority"
else
  ok "check3 description grants no tools or authority (fit wording)"
fi

# Check 8: character count vs voluntary 2,000-character pilot target (draft line 132)
chars=$(wc -m < "$file")
if [ "$chars" -le 2000 ]; then ok "check8 size $chars chars <= 2000 (voluntary pilot target)"; else echo "NOTE  check8 size $chars chars > 2000 (recorded; voluntary criterion only)"; fi

# Check 1: clause coverage — every contract clause verbatim in the body
if [ "$skill" = "applying-bounded-edits" ]; then
  clauses=(
    "Make surgical changes to existing artifacts."
    "Inspect consumers and surrounding conventions, make the smallest reversible replacement, and preserve unrelated content and authority."
    "Confirm the exact target and literal transformation"
    "inspect consumers and nearby context"
    "use a precise replacement"
    "review the diff for collateral changes"
    "run focused checks"
    "stop if the target, owner, or transformation is ambiguous"
  )
else
  clauses=(
    "Select appropriate change capabilities for bounded scopes and risks."
    "Choose code generation, bounded editing, content work, delegation, or another capability from the requirement, scope, and risk rather than habit."
    "Classify the requested transformation as new implementation, surgical edit, content drafting, test work, delegation, or maintenance"
    "verify required tools and permissions"
    "choose the least powerful fitting method"
    "stop when no method is authorized"
  )
fi
for c in "${clauses[@]}"; do
  grep -qF "$c" "$file" && ok "check1 clause verbatim: \"$c\"" || bad "check1 clause MISSING: \"$c\""
done

# Check 4: no references/dependencies on the other candidate skill's files
if grep -qE "(candidate/)?skills/reusable/$other" "$file"; then
  bad "check4 references other skill's path ($other)"
else
  ok "check4 no path reference to $other"
fi

# Check 12: design-view Mermaid block structurally exact vs draft
case "$skill" in
  applying-bounded-edits) dstart=362; dend=371 ;;
  choosing-change-methods) dstart=677; dend=686 ;;
esac
sed -n "${dstart},${dend}p" "$draft" > /tmp/pilot-draft-mermaid.txt
sed -n '/^```mermaid$/,/^```$/p' "$file" > /tmp/pilot-real-mermaid.txt
if diff -q /tmp/pilot-draft-mermaid.txt /tmp/pilot-real-mermaid.txt >/dev/null 2>&1; then
  ok "check12 Design-view Mermaid block exact (draft lines $dstart-$dend)"
else
  bad "check12 Mermaid block differs from draft lines $dstart-$dend"
fi

echo "----"
echo "isolation fixture listing at test time (check 9):"
find "$fixture" -type f | sort
echo "----"
echo "RESULT $skill: pass=$pass fail=$fail chars=$chars"