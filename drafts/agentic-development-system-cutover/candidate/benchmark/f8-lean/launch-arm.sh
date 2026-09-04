#!/usr/bin/env bash
# F8 lean-arm launcher (registered procedure per candidate/benchmark/pre-registration-f8.md; one detached governed top session).
# Usage: bash candidate/benchmark/f8-lean/launch-arm.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

uc="uc10"; arm="lean"
HOST="$PWD"
CON="$HOST/candidate/benchmark/run/f8-lean/$uc/$arm"
RES="$HOST/candidate/benchmark/results/f8-lean-2026-09-03"
LAUNCHER="$HOST/skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts"
MODEL="@preset/abs-medium"
PI_BIN="/shared/store/pi/bin/pi"

uc_text=$(python3 - "$HOST/candidate/benchmark/round6/use-cases.md" "$uc" <<'PYEOF'
import sys, re
text, uc = open(sys.argv[1]).read(), sys.argv[2]
uc_header = uc.replace('uc', 'UC-')
m = re.search(rf'## {uc_header}[^\n]*\n\n(.*?)(?=\n## |\Z)', text, re.S)
if not m: sys.exit('use-case text not found for ' + uc)
print(m.group(1).strip())
PYEOF
)

mkdir -p "$RES/$uc/$arm"
cat > "$RES/$uc/$arm/arm-task-prompt.md" <<PROMPT
BENCHMARK ARM — bounded workflow task. The mechanics below are the fixed registered launch procedure (identical in shape to all round-6 benchmark arms), not workflow guidance; your workflow's own skills and contracts govern how you work.

Fixed harness mechanics (identical in shape to all round-6 arms):
1. Your working directory is $CON. Perform all project work there. Do not read or write any other benchmark arm's or use case's directory, and do not write anywhere under candidate/benchmark/ outside this working directory.
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

mapfile -t skills < <(find "$HOST/skills/reusable" "$HOST/skills/master" -mindepth 1 -maxdepth 1 -type d)

args=(--agent "$HOST/agents/component-builder/agent.md" --cwd "$CON" --no-worktree --caller as-is
  --task-name "f8-lean-$uc-$arm"
  --budget-wall-clock-seconds 3600 --budget-cost-usd 4.00
  --approve --detach --model "$MODEL" --thinking high
  --task "$(cat "$RES/$uc/$arm/arm-task-prompt.md")")
for s in "${skills[@]}"; do args+=(--skill "$s"); done

PI_BIN="$PI_BIN" bun "$LAUNCHER" "${args[@]}"