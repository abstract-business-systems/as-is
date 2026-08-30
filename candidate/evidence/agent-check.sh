#!/usr/bin/env bash
# Full-flow stage-2 per-agent static verification (plan section 9 agent checks: static
# authority/limits mapping; front-matter/tool rules; check 9 isolation listing).
# Usage: agent-check.sh <role> <fixture-root>
set -u
role="$1"; fixture="$2"
file="$fixture/candidate/agents/target/$role/agent.md"
draft="drafts/agentic-development-system-high-level-design-draft11/target-design.md"
pass=0; fail=0
ok()  { echo "PASS  $1"; pass=$((pass+1)); }
bad() { echo "FAIL  $1"; fail=$((fail+1)); }

[ -f "$file" ] || { bad "agent.md not found: $file"; echo "RESULT $role: pass=$pass fail=$fail"; exit 1; }

# Name/directory match (pilot check 2 pattern)
name=$(sed -n '2s/^name: //p' "$file")
[ "$name" = "$role" ] && ok "front-matter name == $role" || bad "name '$name' != $role"
[ "$(basename "$(dirname "$file")")" = "$role" ] && ok "directory name == $role" || bad "directory mismatch"

# Description: one line, fit-not-permission (pilot check 3 pattern)
desc=$(sed -n '3s/^description: //p' "$file")
[ -n "$desc" ] && ok "description present: $desc" || bad "description missing"
if echo "$desc" | grep -qiE 'grant(s|ing)? (tools|authority)|you (may|must|shall)|is authorized to|permission to'; then
  bad "description may grant tools/authority"
else
  ok "description grants no tools or authority (fit wording)"
fi

# Tools: non-empty declaration (launcher hard-rejects empty; checklist section 7 note)
tools=$(sed -n 's/^tools: //p' "$file" | head -1)
[ -n "$tools" ] && ok "tools declared: $tools" || bad "tools empty or missing"

# Advisory roles must be read-only; component-builder adds narrowly authorized mutation
case "$role" in
  component-builder)
    echo "$tools" | grep -qE 'edit|write' && ok "component-builder declares mutation capability" || bad "component-builder missing mutation capability"
    echo "$tools" | grep -qE 'bash' && bad "component-builder shell access beyond smallest capability" || ok "no shell tool declared"
    ;;
  *)
    echo "$tools" | grep -qE 'edit|write|bash|call_subagent' && bad "advisory role declares mutation/delegation tools" || ok "advisory role read-only tools"
    ;;
esac

# Static authority/limits mapping: required phrases from cited target-design rows
req() { grep -qiF "$2" "$file" && ok "limits row phrase present: $1" || bad "MISSING row phrase ($1): $2"; }
case "$role" in
  as-is-orchestrator)
    req "7.1:312 authority" "Root lifecycle coordination, human interaction, status synthesis, routing, and escalation"
    req "7.1:312 limit" "does not implement component work"
    req "7.1:312 limit" "does not infer human acceptance"
    req "8:368 disposition" "non-implementing"
    ;;
  component-builder)
    req "7.1:314 parent authority" "identifying impacted children"
    req "7.1:314 parent limit" "does not semantically review, validate, approve, cherry-pick, or integrate a separately owned child"
    req "7.1:316 child authority" "implements the injected plan"
    req "7.1:316 child limit" "parent plan"
    req "7.1:316 child limit" "sibling scope"
    req "7.1:316 child limit" "accepted envelope"
    req "7.1:316 child limit" "parent task state"
    req "7.1:316 child limit" "protected parent artifacts"
    req "10.6:611" "Do not infer completion"
    req "10.6:612" "Do not restart or retry automatically"
    req "10.6:613" "Do not silently widen scope"
    ;;
  evidence-validator)
    req "7.1:317 authority" "Evaluates supplied evidence against acceptance"
    req "7.1:317 limits" "No mutation, task admission, parent integration, or human acceptance authority"
    req "8:370" "Read-only acceptance-to-evidence review"
    ;;
  execution-advisor)
    req "7.1:322 limits" "Never defines task status, budget, recovery, or completion"
    req "8:371 authority" "Bounded trace/session analysis, process improvement, and budget evidence"
    req "8:371 note" "supplementary"
    ;;
  expert)
    req "7.1:318 authority" "bounded advisory or externally required domain judgment"
    req "7.1:318 limits" "does not gain authority merely by reviewing"
    req "8:372" "Not an alternate-model/family target gate"
    ;;
  design-prototyper)
    req "7.1:313 authority" "Produces prototypes, target designs, component hierarchies, and implementation packets within design scope"
    req "7.1:313 limits" "cannot accept its own envelope"
    req "7.1:313 limits" "authorize implementation"
    req "8:375" "Separate authorship from human acceptance"
    ;;
esac

echo "----"
echo "isolation fixture listing at test time (check 9 pattern):"
find "$fixture" -type f 2>/dev/null | sort
echo "----"
echo "RESULT $role: pass=$pass fail=$fail"