#!/usr/bin/env bash
# Full-flow stage-3 per-master static fidelity checks (plan section 9 adapted: checks 1-5, 8, 12
# plus composition-fidelity check 13; check 9 isolation listing).
# Usage: fidelity-check-master.sh <master-name> <fixture-root>
set -u
skill="$1"; fixture="$2"
file="$fixture/candidate/skills/master/$skill/SKILL.md"
draft="drafts/composable-skills.md"
pass=0; fail=0
ok()  { echo "PASS  $1"; pass=$((pass+1)); }
bad() { echo "FAIL  $1"; fail=$((fail+1)); }

H=$(grep -n "^### \`$skill\`$" "$draft" | head -1 | cut -d: -f1)
if [ -z "$H" ]; then bad "draft heading not found: $skill"; echo "RESULT $skill: pass=$pass fail=$fail"; exit 1; fi
N=$(awk -v h="$H" 'NR>h && /^### /{print NR; exit}' "$draft")
[ -z "$N" ] && N=946
dp=$((H+2)); da=$((H+4)); dh=$((H+6))
purpose=$(sed -n "${dp}p" "$draft" | sed 's/^\*\*Purpose\*\*: //')
approach=$(sed -n "${da}p" "$draft" | sed 's/^\*\*Approach\*\*: //')
how=$(sed -n "${dh}p" "$draft" | sed 's/^\*\*How it should be done\*\*: //')

name=$(sed -n '2s/^name: //p' "$file")
[ "$name" = "$skill" ] && ok "check2 front-matter name == $skill" || bad "check2 name '$name' != $skill"
[ "$(basename "$(dirname "$file")")" = "$skill" ] && ok "check2 directory name == $skill" || bad "check2 directory mismatch"

desc=$(sed -n '3s/^description: //p' "$file")
[ -n "$desc" ] && ok "check3 description present" || bad "check3 description missing"
if echo "$desc" | grep -qiE 'grant(s|ing)? (tools|authority)|you (may|must|shall)|is authorized to|permission to'; then
  bad "check3 description may grant tools/authority"
else
  ok "check3 description grants no tools or authority (fit wording)"
fi

chars=$(wc -m < "$file")
if [ "$chars" -le 2000 ]; then ok "check8 size $chars chars <= 2000"; else echo "NOTE  check8 size $chars chars > 2000 (masters may exceed the voluntary target: compositions, gates, recovery, stopping rules; draft line 132)"; fi

i=0
for clause in "$purpose" "$approach" "$how"; do
  i=$((i+1)); case $i in 1) lbl=Purpose; ln=$dp;; 2) lbl=Approach; ln=$da;; 3) lbl=How; ln=$dh;; esac
  grep -qF "$clause" "$file" && ok "check1 $lbl clause verbatim (draft line $ln)" || bad "check1 $lbl clause MISSING"
done

secs=$(grep -E '^## ' "$file" | sed 's/^#* //' | tr '\n' '|')
if [ "$secs" = "Purpose|Approach|How it should be done|Design view|Composition context|" ]; then
  ok "check4 sections exactly Purpose/Approach/How it should be done/Design view/Composition context"
else
  bad "check4 section set differs: $secs"
fi

# Composition context must not reference other candidate artifact file paths
if grep -qE "candidate/skills/(reusable|master)/" "$file"; then
  bad "check4 contains a candidate artifact path reference"
else
  ok "check4 no path reference to other candidate artifacts"
fi

# Check 12: design-view Mermaid block byte-equal vs draft
awk -v h="$H" 'NR>h && /^```mermaid$/{f=1} f{print} f && /^```$/ && NR>h+1{exit}' "$draft" > /tmp/fm-draft-mermaid.txt
sed -n '/^```mermaid$/,/^```$/p' "$file" > /tmp/fm-real-mermaid.txt
if diff -q /tmp/fm-draft-mermaid.txt /tmp/fm-real-mermaid.txt >/dev/null 2>&1; then
  ok "check12 Design-view Mermaid block byte-equal"
else
  bad "check12 Mermaid block differs from draft"
fi

# Check 13: composition fidelity — every named composition entry present in Composition context
CC=$(awk '/^## Composition context/{f=1} f' "$file")
req() { echo "$CC" | grep -qiF "$2" && ok "check13 composition entry: $1" || bad "check13 MISSING composition entry: $1"; }
case "$skill" in
  making-changes)
    for e in "Component-based change" "Non-component change" "resolving-scopes" "identifying-owners" "building-context" "choosing-change-methods" "implementing-tasks" "applying-bounded-edits" "writing-tests" "validating-changes" "locating-changelogs" "managing-changelogs" "making-changes = resolving-scopes"; do req "$e" "$e"; done
    ;;
  building-components)
    for e in "parent plan injection or child plan intake" "child-local implementation" "child-level verification" "child integration with parent worktree" "status handoff" "parent planning accounting" "preparing-scoped-commits" "managing-changelogs" "implementing-tasks" "building-components = resolving-scopes"; do req "$e" "$e"; done
    ;;
  implementing-tasks)
    req "component-based order position" "choosing-change-methods"
    req "implementing-tasks entry" "implementing-tasks"
    ;;
  managing-changelogs)
    req "changelog resolution rule" "must not select a changelog merely because it is the nearest file with that name"
    req "no-history-required rule" "no history required"
    req "managing-changelogs entry" "managing-changelogs"
    ;;
  spawning-subagents)
    req "tool-access row 123" "never inferred from a skill reference"
    ;;
  committing-completed-work)
    req "tool-access row 124" "cannot grant commit authority"
    ;;
  exploring-execution-evidence)
    req "building-context entry" "building-context"
    req "inspecting-execution-evidence entry" "inspecting-execution-evidence"
    req "recording-evidence entry" "recording-evidence"
    ;;
  *)
    req "tool-access acknowledgment" "A skill does not grant tools"
    ;;
esac

echo "----"
echo "isolation fixture listing at test time (check 9):"
find "$fixture" -type f 2>/dev/null | sort
echo "----"
echo "RESULT $skill: pass=$pass fail=$fail chars=$chars"