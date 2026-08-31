#!/usr/bin/env bash
# Round-4 arm launcher (registered procedure per pre-registration-v5.md; one arm = one detached governed child session).
# Usage: bash candidate/benchmark/round5/launch-arm.sh <uc> <arm>
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

uc="$1"; arm="$2"
HOST="$PWD"
CON="$HOST/candidate/benchmark/run/round-5/$uc/$arm"
RES="$HOST/candidate/benchmark/results/round-5-2026-09-01"
LAUNCHER="$HOST/skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts"
MODEL="z-ai/glm-5.3-flash"

mkdir -p "$RES/$uc/$arm"

case "$arm" in
  baseline)
    agent="/tmp/bench-r4/baseline-workflow/agents/component-builder/agent.md"
    mapfile -t skills < <(find /tmp/bench-r4/baseline-workflow/skills -mindepth 1 -maxdepth 1 -type d)
    ;;
  candidate)
    agent="$HOST/candidate/agents/implementer/agent.md"
    mapfile -t skills < <(find /tmp/bench-r4/candidate/skills/reusable /tmp/bench-r4/candidate/skills/master -mindepth 1 -maxdepth 1 -type d)
    ;;
  *) echo "unknown arm: $arm"; exit 1;;
esac

uc_text=$(python3 - "$HOST/candidate/benchmark/round5/use-cases.md" "$uc" <<'PYEOF'
import sys, re
text, uc = open(sys.argv[1]).read(), sys.argv[2]
uc_header = uc.replace('uc', 'UC-')
m = re.search(rf'## {uc_header}[^\n]*\n\n(.*?)(?=\n## |\Z)', text, re.S)
if not m: sys.exit('use-case text not found for ' + uc)
print(m.group(1).strip())
PYEOF
)

cat > "$RES/$uc/$arm/arm-task-prompt.md" <<PROMPT
BENCHMARK ARM — bounded workflow task. The mechanics below are the fixed registered launch procedure (identical for all round-5 benchmark arms), not workflow guidance; your workflow's own skills and compositions govern how you work.

Fixed harness mechanics (identical for all round-5 arms):
1. Your working directory is $CON. Perform all project work there. Do not read or write any other benchmark arm's or use case's directory, and do not write anywhere under candidate/benchmark/ outside this working directory.
2. The working directory is a git-init'd plain copy of the pinned seed project with no initial commit. If you delegate through the governed launcher, pass --cwd $CON and --no-worktree, and use absolute paths for the launcher script ($LAUNCHER) and for any --agent or --skill path you pass.
3. Arm budget: total agent spend <= \$2.00 (including every agent you delegate to) and wall clock <= 3600 s from now to your status report. Forward budgets to any launcher calls you make so the arm totals stay within these caps. Do not retry failed workflow steps; a failed step is a recorded result, not a re-roll.
4. Model for every role in this arm: $MODEL via openrouter (pass --model $MODEL on launcher calls).
5. Deterministic validation: run \`bash checks/validate.sh\` in the working directory before reporting status.

Task: First perform the setup your workflow prescribes for adopting it in an existing project (the seed ships no agent-workflow configuration by design), then handle exactly the following request, then report status.

--- REQUEST (verbatim) ---
$uc_text
--- END REQUEST ---

Your final status report must include: what setup was performed and where its records live, files changed, check results (verbatim output and exit codes), how the bounded scope was resolved (including any stop-for-direction), and any unresolved questions. Do not claim completion you cannot evidence.
PROMPT

args=(--agent "$agent" --cwd "$CON" --no-worktree --caller as-is
  --task-name "round5-$uc-$arm"
  --budget-wall-clock-seconds 3600 --budget-cost-usd 2.00
  --approve --detach --model "$MODEL"
  --task "$(cat "$RES/$uc/$arm/arm-task-prompt.md")")
for s in "${skills[@]}"; do args+=(--skill "$s"); done

bun "$LAUNCHER" "${args[@]}"