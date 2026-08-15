#!/usr/bin/env python3
"""Deterministically validate JSON-companion component task-record trees."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


STATUSES = {"ready", "active", "blocked", "awaiting-approval", "completed", "failed", "cancelled"}
TERMINAL = {"completed", "failed", "cancelled"}
EFFECT_RANK = {"prohibited": 0, "require-current-turn-user-approval": 1}
SECTIONS = ("Requirement", "Plan", "Progress", "Validation", "Result", "Blockers And Escalations", "Recovery", "Next Action")


class ValidationError(Exception):
    pass


@dataclass
class Record:
    directory: Path
    data: dict[str, Any]
    body: str

    @property
    def label(self) -> str:
        return self.directory.as_posix()


def load_record(directory: Path, task_name: str) -> Record:
    companion_path = directory / "as-is.json"
    narrative_path = directory / task_name
    try:
        companion = json.loads(companion_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValidationError(f"{companion_path}: invalid or unreadable JSON companion: {error}") from error
    if not isinstance(companion, dict) or not isinstance(companion.get("task"), dict):
        raise ValidationError(f"{companion_path}: task must be an object")
    try:
        body = narrative_path.read_text(encoding="utf-8")
    except OSError as error:
        raise ValidationError(f"{narrative_path}: cannot read: {error}") from error
    if body.startswith("---\n"):
        raise ValidationError(f"{narrative_path}: legacy YAML task narrative is unsupported")
    task = companion["task"]
    return Record(directory, {
        "as-is-version": 2,
        "task": {key: task[key] for key in ("status", "worker", "updated") if key in task},
        "constraints": task.get("constraints"),
        "acceptance": task.get("acceptance"),
    }, body)


def require_keys(where: str, value: Any, expected: set[str], errors: list[str]) -> bool:
    if not isinstance(value, dict):
        errors.append(f"{where}: must be a mapping")
        return False
    unknown, missing = set(value) - expected, expected - set(value)
    if unknown:
        errors.append(f"{where}: unknown fields: {', '.join(sorted(unknown))}")
    if missing:
        errors.append(f"{where}: missing fields: {', '.join(sorted(missing))}")
    return not unknown and not missing


def number(where: str, value: Any, errors: list[str]) -> bool:
    if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
        errors.append(f"{where}: must be a non-negative number")
        return False
    return True


def validate_shape(record: Record, errors: list[str]) -> None:
    data, label = record.data, record.label
    require_keys(label, data, {"as-is-version", "task", "constraints", "acceptance"}, errors)
    if data.get("as-is-version") != 2:
        errors.append(f"{label}: as-is-version must be 2")
    task = data.get("task")
    if isinstance(task, dict) and require_keys(f"{label}.task", task, {"status", "worker", "updated"}, errors):
        if task["status"] not in STATUSES:
            errors.append(f"{label}.task.status: invalid status")
        if not isinstance(task["worker"], str) or not task["worker"]:
            errors.append(f"{label}.task.worker: must be a non-empty string")
        if not isinstance(task["updated"], str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", task["updated"]):
            errors.append(f"{label}.task.updated: must be an RFC 3339 UTC timestamp")
        else:
            try:
                dt.datetime.strptime(task["updated"], "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                errors.append(f"{label}.task.updated: invalid timestamp")
    constraints = data.get("constraints")
    if not isinstance(constraints, dict) or not require_keys(f"{label}.constraints", constraints, {"cost", "delegation", "execution", "external-effects"}, errors):
        return
    cost = constraints["cost"]
    if isinstance(cost, dict) and require_keys(f"{label}.constraints.cost", cost, {"currency", "allocated", "spent", "reserve", "source", "fallback-metric"}, errors):
        for key in ("allocated", "spent", "reserve"):
            number(f"{label}.constraints.cost.{key}", cost[key], errors)
        if not isinstance(cost["currency"], str) or not cost["currency"]:
            errors.append(f"{label}.constraints.cost.currency: must be a non-empty string")
        if cost["spent"] + cost["reserve"] > cost["allocated"]:
            errors.append(f"{label}.constraints.cost: spent plus reserve exceeds allocation")
    delegation = constraints["delegation"]
    if isinstance(delegation, dict) and require_keys(f"{label}.constraints.delegation", delegation, {"maximum-depth", "maximum-children"}, errors):
        for key in ("maximum-depth", "maximum-children"):
            if not isinstance(delegation[key], int) or isinstance(delegation[key], bool) or delegation[key] < 0:
                errors.append(f"{label}.constraints.delegation.{key}: must be a non-negative integer")
    execution = constraints["execution"]
    if isinstance(execution, dict) and require_keys(f"{label}.constraints.execution", execution, {"wall-clock"}, errors):
        wall = execution["wall-clock"]
        if isinstance(wall, dict) and require_keys(f"{label}.constraints.execution.wall-clock", wall, {"allocated-seconds", "spent-seconds", "reserve-seconds", "source"}, errors):
            for key in ("allocated-seconds", "spent-seconds", "reserve-seconds"):
                number(f"{label}.constraints.execution.wall-clock.{key}", wall[key], errors)
            if wall["spent-seconds"] + wall["reserve-seconds"] > wall["allocated-seconds"]:
                errors.append(f"{label}.constraints.execution.wall-clock: spent plus reserve exceeds allocation")
    if constraints["external-effects"] not in EFFECT_RANK:
        errors.append(f"{label}.constraints.external-effects: unsupported policy")
    if not isinstance(data.get("acceptance"), list) or not data["acceptance"] or not all(isinstance(item, str) and item for item in data["acceptance"]):
        errors.append(f"{label}.acceptance: must be a non-empty string list")
    for section in SECTIONS:
        if not re.search(rf"^## {re.escape(section)}\s*$", record.body, re.MULTILINE):
            errors.append(f"{label}: missing body section {section}")


def result_section(body: str) -> str:
    match = re.search(r"^## Result\s*$([\s\S]*?)(?=^## |\Z)", body, re.MULTILINE)
    return match.group(1) if match else ""


def validate_tree(root: Path) -> list[str]:
    root_companion = root / "as-is.json"
    try:
        root_data = json.loads(root_companion.read_text(encoding="utf-8"))
        task_name = root_data.get("configuration", {}).get("records", {}).get("filenames", {}).get("task", "tasks.md")
    except (OSError, json.JSONDecodeError, AttributeError) as error:
        return [f"{root_companion}: invalid or unreadable root companion: {error}"]
    if not isinstance(task_name, str) or not task_name or "/" in task_name or "\\" in task_name or task_name == "as-is.md":
        return [f"{root_companion}: configured task filename is unsafe"]
    records = {}
    for path in sorted(root.rglob("as-is.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            return [f"{path}: invalid or unreadable JSON companion: {error}"]
        if isinstance(data, dict) and "task" in data:
            records[path.parent] = load_record(path.parent, task_name)
    if root not in records:
        return [f"{root}: no root JSON task record"]
    errors: list[str] = []
    for record in records.values():
        validate_shape(record, errors)
    for directory, parent in records.items():
        children = [record for child_directory, record in records.items() if child_directory.parent == directory]
        constraints = parent.data.get("constraints", {})
        if not isinstance(constraints, dict):
            continue
        delegation = constraints.get("delegation", {})
        if not isinstance(delegation, dict):
            continue
        if isinstance(delegation.get("maximum-children"), int) and len(children) > delegation["maximum-children"]:
            errors.append(f"{parent.label}: child count exceeds maximum-children")
        cost_total = wall_total = 0
        for child in children:
            child_constraints = child.data.get("constraints", {})
            if not isinstance(child_constraints, dict):
                continue
            child_delegation = child_constraints.get("delegation", {})
            if not isinstance(child_delegation, dict):
                continue
            parent_effect, child_effect = constraints.get("external-effects"), child_constraints.get("external-effects")
            if parent_effect in EFFECT_RANK and child_effect in EFFECT_RANK and EFFECT_RANK[child_effect] > EFFECT_RANK[parent_effect]:
                errors.append(f"{child.label}: external-effects weakens parent policy")
            if isinstance(delegation.get("maximum-depth"), int) and isinstance(child_delegation.get("maximum-depth"), int) and child_delegation["maximum-depth"] > delegation["maximum-depth"] - 1:
                errors.append(f"{child.label}: maximum-depth weakens parent delegation limit")
            if isinstance(delegation.get("maximum-children"), int) and isinstance(child_delegation.get("maximum-children"), int) and child_delegation["maximum-children"] > delegation["maximum-children"]:
                errors.append(f"{child.label}: maximum-children weakens parent delegation limit")
            cost_total += child_constraints.get("cost", {}).get("allocated", 0)
            wall_total += child_constraints.get("execution", {}).get("wall-clock", {}).get("allocated-seconds", 0)
        remaining_cost = constraints.get("cost", {}).get("allocated", 0) - constraints.get("cost", {}).get("spent", 0) - constraints.get("cost", {}).get("reserve", 0)
        remaining_wall = constraints.get("execution", {}).get("wall-clock", {}).get("allocated-seconds", 0) - constraints.get("execution", {}).get("wall-clock", {}).get("spent-seconds", 0) - constraints.get("execution", {}).get("wall-clock", {}).get("reserve-seconds", 0)
        if cost_total > remaining_cost:
            errors.append(f"{parent.label}: child cost allocations exceed remaining budget")
        if wall_total > remaining_wall:
            errors.append(f"{parent.label}: child wall-clock allocations exceed remaining budget")
        if parent.data.get("task", {}).get("status") == "completed":
            descendants = [(directory.relative_to(parent.directory).as_posix(), record) for directory, record in records.items() if directory != parent.directory and parent.directory in directory.parents]
            for relative, descendant in descendants:
                status = descendant.data.get("task", {}).get("status")
                if status not in TERMINAL:
                    errors.append(f"{parent.label}: completed record has non-terminal descendant {relative}")
                elif status in {"failed", "cancelled"} and relative not in result_section(parent.body):
                    errors.append(f"{parent.label}: completed record does not account for {status} descendant {relative} in Result")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path, help="root component directory containing as-is.md")
    args = parser.parse_args()
    try:
        errors = validate_tree(args.directory.resolve())
    except ValidationError as error:
        errors = [str(error)]
    if errors:
        print("INVALID")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print("VALID")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
