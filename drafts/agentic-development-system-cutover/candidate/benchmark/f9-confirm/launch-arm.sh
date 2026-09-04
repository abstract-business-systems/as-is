#!/usr/bin/env bash
# F9-C1 confirmation candidate-arm launcher (variant of the registered f9-cutover procedure per
# drafts/agentic-development-system-cutover/benchmark-confirmation-addendum-f9c1.md; one detached
# governed top session; paths updated for the runtime re-home and the flattened skills tree).
# Usage: bash drafts/agentic-development-system-cutover/candidate/benchmark/f9-confirm/launch-arm.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

uc="uc10"
HOST="$PWD"
BENCH="drafts/agentic-development-system-cutover/candidate/benchmark"
CON="$HOST/$BENCH/run/f9-confirm/$uc/candidate"
RES="$HOST/$BENCH/results/f9-confirm-2026-09-04"
MODEL="@preset/abs-medium"
# Post re-home launcher location and flat skills seeding (the only procedure deltas; addendum F9-C1).
LAUNCHER="$HOST/core/adapters/pi/scripts/spawn-pi-subagent.ts"
AGENT="$HOST/agents/component-builder/agent.md"
PI_BIN="/shared/store/pi/bin/pi"
RUNDIR="$HOST"
mapfile -t skills < <(find "$HOST/skills" -mindepth 1 -maxdepth 1 -type d)

uc_text=$(python3 - "$HOST/$BENCH/round6/use-cases.md" "$uc" <<'PYEOF'
import sys, re
text, uc = open(sys.argv[1]).read(), sys.argv[2]
uc_header = uc.replace('uc', 'UC-')
m = re.search(rf'## {uc_header}[^\n]*\n\n(.*?)(?=\n## |\Z)', text, re.S)
if not m: sys.exit('use-case text not found for ' + uc)
print(m.group(1).strip())
PYEOF
)

mkdir -p "$RES/$uc/candidate"
cat > "$RES/$uc/candidate/arm-task-prompt.md" <<PROMPT
BENCHMARK ARM — bounded workflow task. The mechanics below are the fixed registered launch procedure (identical in shape to the round-6, F8, and F9 benchmark arms), not workflow guidance; your workflow's own skills and contracts govern how you work.

Fixed harness mechanics (identical in shape across the F9 arms):
1. Your working directory is $CON. Perform all project work there. Do not read or write any other benchmark arm's or use case's directory, and do not write anywhere under $BENCH/ outside this working directory.
2. The working directory is a git-init'd plain copy of the pinned seed project with no initial commit. If you delegate through the governed launcher, pass --cwd $CON and --no-worktree, and use absolute paths for the launcher script ($LAUNCHER) and for any --agent or --skill path you pass.
3. Child-agent policy (pinned): when you delegate implementation work to child workers, launch them either WITHOUT --agent (launcher default capability set applies, proven in rounds 2-4) or with an agent whose front matter declares a non-empty \`tools:\` set. Do NOT pass an agent file with a missing \`tools:\` declaration - the governed launcher grants such agents an explicit empty capability set and the child cannot work.
4. Arm budget: total agent spend <= \$4.00 (including every agent you delegate to) and wall clock <= 3600 s from now to your status report. Forward budgets to any launcher calls you make so the arm totals stay within these caps. Do not retry failed workflow steps; a failed step is a recorded result, not a re-roll.
5. Model for every role in this arm: $MODEL via openrouter (pass --model "$MODEL" on launcher calls). Thinking level for every role: high (pass --thinking high on launcher calls so no agent front-matter or project default downgrades it).
6. Deterministic validation: run \`bash checks/validate.sh\` in the working directory before reporting status.

Task: First perform the setup your workflow prescribes for adopting it in an existing project (the seed ships no agent-workflow configuration by design), then handle exactly the following request, then report status.

--- REQUEST (verbatim) ---
$uc_text
--- END REQUEST ---

Your final status report must include: what setup was performed and where its records live, files changed, check results (verbatim output and exit codes), how the bounded scope was resolved (including any stop-for-direction), and any unresolved questions. Do not claim completion you cannot evidence.
PROMPT

args=(--agent "$AGENT" --cwd "$CON" --no-worktree --caller as-is
  --task-name "f9-confirm-$uc-candidate"
  --budget-wall-clock-seconds 3600 --budget-cost-usd 4.00
  --approve --detach --model "$MODEL" --thinking high
  --task "$(cat "$RES/$uc/candidate/arm-task-prompt.md")")
for s in "${skills[@]}"; do args+=(--skill "$s"); done

PI_BIN="$PI_BIN" bun "$LAUNCHER" "${args[@]}"