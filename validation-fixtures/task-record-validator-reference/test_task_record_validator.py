import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


HERE = Path(__file__).parent
VALIDATOR = HERE / "task_record_validator.py"


def record(status="active", *, cost=6, wall=60, depth=1, children=2,
           effects="require-current-turn-user-approval", result="- Pending."):
    return {
        "task": {
            "status": status,
            "worker": "implementer",
            "updated": "2026-07-26T14:00:00Z",
            "constraints": {
                "cost": {"currency": "USD", "allocated": cost, "spent": 1, "reserve": 1,
                         "source": "unavailable", "fallback-metric": "unavailable"},
                "delegation": {"maximum-depth": depth, "maximum-children": children},
                "execution": {"wall-clock": {"allocated-seconds": wall, "spent-seconds": 10,
                                                "reserve-seconds": 10, "source": "unavailable"}},
                "external-effects": effects,
            },
            "acceptance": ["A bounded result."],
        },
        "narrative": f"""# Task
## Requirement
Text.
## Plan
Text.
## Progress
Text.
## Validation
Text.
## Result
{result}
## Blockers And Escalations
Text.
## Recovery
Text.
## Next Action
Text.
""",
    }


class TaskRecordValidatorTests(unittest.TestCase):
    def setUp(self):
        self.temp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.temp)

    def write(self, relative, contents):
        directory = self.temp / relative
        directory.mkdir(parents=True, exist_ok=True)
        (directory / "as-is.md").write_text("# Test\n")
        companion = {"task": contents["task"]}
        if relative == ".":
            companion["configuration"] = {"records": {"filenames": {"task": "tasks.md"}}}
        (directory / "as-is.json").write_text(json.dumps(companion))
        (directory / "tasks.md").write_text(contents["narrative"])

    def run_validator(self):
        return subprocess.run(["python3", str(VALIDATOR), str(self.temp)], text=True, capture_output=True)

    def test_accepts_configuration_only_root_after_task_cleanup(self):
        directory = self.temp
        (directory / "as-is.json").write_text(json.dumps({"configuration": {"records": {"filenames": {"task": "tasks.md"}}}}))
        result = self.run_validator()
        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertEqual(result.stdout, "VALID\n")

    def test_accepts_valid_tree(self):
        self.write(".", record(status="completed", result="- Child `child` completed normally."))
        self.write("child", record(status="completed", cost=4, wall=40, depth=0, children=0))
        result = self.run_validator()
        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertEqual(result.stdout, "VALID\n")

    def test_rejects_weakened_external_effect_policy(self):
        self.write(".", record(effects="prohibited"))
        self.write("child", record(effects="require-current-turn-user-approval", depth=0, children=0))
        result = self.run_validator()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("external-effects weakens parent policy", result.stdout)

    def test_rejects_weakened_delegation_limit(self):
        self.write(".", record(depth=1, children=1))
        self.write("child", record(depth=1, children=2))
        result = self.run_validator()
        self.assertIn("maximum-depth weakens parent delegation limit", result.stdout)
        self.assertIn("maximum-children weakens parent delegation limit", result.stdout)

    def test_rejects_child_cost_and_wall_budget_excess(self):
        self.write(".", record(cost=5, wall=50))
        self.write("child", record(cost=4, wall=40, depth=0, children=0))
        result = self.run_validator()
        self.assertIn("child cost allocations exceed remaining budget", result.stdout)
        self.assertIn("child wall-clock allocations exceed remaining budget", result.stdout)

    def test_rejects_completed_record_with_non_terminal_descendant(self):
        self.write(".", record(status="completed"))
        self.write("child", record(depth=0, children=0))
        result = self.run_validator()
        self.assertIn("non-terminal descendant child", result.stdout)

    def test_rejects_unaccounted_failed_descendant(self):
        self.write(".", record(status="completed"))
        self.write("child", record(status="failed", depth=0, children=0))
        result = self.run_validator()
        self.assertIn("does not account for failed descendant child", result.stdout)


if __name__ == "__main__":
    unittest.main()
