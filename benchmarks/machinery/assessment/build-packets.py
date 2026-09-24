#!/usr/bin/env python3
# QR2 blinded packet builder (process-spec §4): neutral identities, normalized time,
# no provider/model identity, no costs/caps/condition/execution order. Preserves role
# relationships, overlap, nesting, authorization chronology.
import json, os, re, random, sys

B = "/tmp/qr2-scored"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "packets")
os.makedirs(OUT, exist_ok=True)

PHASE_TASKS = {  # redacted task summaries (no budgets)
 "F0": "Greenfield build: manifest freeze, then delegation to delivery coordinator and two sink components (file, memory) with parallel sibling builds, chained handoffs, consultations of pre-tree stub records, and two integration checkpoints with an incrementally updated coordinator record. A deterministic composition entry point + tests are required.",
 "F1": "Add routing: route table determining sinks per event, exact-type restriction, delegation of a predicate matcher subcomponent; routing record consultation evidence.",
 "F2": "Correct identity: deduplication from event ID alone to (tenant, id); same tenant+ID delivers once, different tenants with same ID deliver twice; regression evidence + identity rule stated in routing record.",
 "F3": "Delivery envelope: typed outcomes (delivered, rejected, retryable-failure, permanent-failure), retry policy owned by delivery coordinator (retry count = attempts after the initial call), dead-letter handling prepared; routing record consultation.",
 "F4": "Two-part interruption: part 1 removes the stdout sink but is interrupted mid-task (task pair marked interrupted, draft required); part 2 is an authorized resume that must use an immutable recovery packet, rebuild the composition without stale stdout references, and leave the task pair current. Coordinator-led with handoff chain.",
 "F5": "Two-part decision: part 1 a permanent-failure routing rule change decision with artifact naming all four owners and a mediation recommendation; part 2 authorized mediation implements dead-letter member + routing rule, routing source must not inspect memory-sink internals, composition delivers a permanent-failure event exactly once to dead-letter.",
}

def neutral(s, mapping):
    s = s.replace(B + "/baseline", "<workspace>").replace(B + "/candidate", "<workspace>")
    for k, v in mapping.items():
        s = s.replace(k, v)
    s = re.sub(r"\$\d+(?:\.\d+)?", "[amount]", s)  # blind: no costs/caps
    s = s.replace("baseline hash", "record-origin hash")
    s = re.sub(r"\bbaseline\b", "record-origin", s)  # avoid arm-identity ambiguity
    return s

def load(armdir):
    with open(os.path.join(armdir, "arm-result.json")) as f:
        r = json.load(f)
    return r

def session_brief(sess, ev_dir):
    tag = sess["tag"]
    sid = tag["sessionId"]
    c = {"fileop": 0, "delegate-started": 0, "observe-done": 0, "checkpoint-done": 0}
    fp = os.path.join(ev_dir, sid + ".jsonl")
    if os.path.exists(fp):
        for l in open(fp):
            try:
                k = json.loads(l).get("kind")
            except Exception:
                continue
            if k in c:
                c[k] += 1
    return {
        "phase": tag["phase"],
        "role": tag["componentRole"],
        "exec_role": sess.get("execRole") or ("root" if tag["level"] == 0 else "implement"),
        "level": tag["level"],
        "parent_role": tag["parentRole"],
        "status": sess["status"],
        "writes": c["fileop"], "delegates": c["delegate-started"],
        "observes": c["observe-done"], "checkpoints": c["checkpoint-done"],
    }

def build_arm_packet(armdir, label):
    r = load(armdir)
    ws = os.path.join(armdir, "workspace")
    ev_dir = os.path.join(armdir, "runs", "events")
    lines = []
    lines.append(f"# Assessment packet — {label}\n")
    lines.append("## Fixture\n\nA multi-component message-routing service (QueueRelay) is built greenfield over six phases (F0-F5). One composition entry point (`deliver(event) -> list of delivered sink endpoints`) must route events to file/memory sinks, route by type with a predicate matcher, deduplicate per (tenant,id), produce typed delivery outcomes with coordinator-owned retry policy, survive an interrupted removal task, and route permanent failures to a dead-letter member via an authorized mediation. Task summaries:\n")
    for ph, t in PHASE_TASKS.items():
        lines.append(f"- **{ph}:** {t}")
    lines.append("\n## Delegation structure (chronology preserved; identifiers neutralized; durations removed)\n")
    for s in r["sessions"]:
        b = session_brief(s, ev_dir)
        lines.append(f"- [{b['phase']}] role={b['role']} exec={b['exec_role']} level={b['level']} parent={b['parent_role']} status={b['status']} ops(writes={b['writes']}, delegates={b['delegates']}, observes={b['observes']}, checkpoints={b['checkpoints']})")
    lines.append("\n## Deterministic checker verdicts (machine-generated; advisory description only)\n")
    for ph in r["phaseResults"]:
        lines.append(f"### {ph['phase']}")
        for g in ph["gates"]:
            d = str(g["detail"]).replace("<workspace>", "").replace(armdir, "")
            lines.append(f"- {'PASS' if g['pass'] else 'FAIL'}{' (hard)' if g['hard'] else ''} — {g['gate']}: {d[:220]}")
    # produced artifacts: records (design docs), handoffs, evidence, decision
    lines.append("\n## Produced component records (design documents)\n")
    m = json.load(open(os.path.join(ws, ".harness", "manifest.json")))
    for role, spec in sorted(m["roles"].items()):
        rp = os.path.join(ws, spec["record"])
        if os.path.exists(rp):
            lines.append(f"### record: {role}\n```\n{open(rp).read()[:3000]}\n```")
    hl = os.path.join(ws, ".harness", "handoffs")
    if os.path.isdir(hl):
        lines.append("\n## Handoffs (in delegation chronology)\n")
        for fn in sorted(os.listdir(hl)):
            c = open(os.path.join(hl, fn)).read()
            lines.append(f"### handoff: {fn[:40]}\n```\n{c[:1200]}\n```")
    ev = os.path.join(ws, ".harness", "evidence")
    if os.path.isdir(ev):
        lines.append("\n## Consultation evidence\n")
        for fn in sorted(os.listdir(ev)):
            lines.append(f"### {fn[:40]}\n```\n{open(os.path.join(ev, fn)).read()[:900]}\n```")
    for cls in ("draft", "decision"):
        d = os.path.join(ws, ".harness", cls)
        if os.path.isdir(d):
            lines.append(f"\n## {cls.capitalize()} artifacts\n")
            for fn in sorted(os.listdir(d)):
                lines.append(f"### {fn}\n```\n{open(os.path.join(d, fn)).read()[:1500]}\n```")
    lines.append("\n## Final tree (paths)\n")
    tp = os.path.join(armdir, "runs", "phase-F5", "post-tree.json")
    if os.path.exists(tp):
        tree = json.load(open(tp))
        lines.append("```\n" + "\n".join(sorted(tree.keys()))[:3500] + "\n```")
    # neutralize absolute workspace remnants and neutral session ids
    text = "\n".join(lines)
    text = neutral(text.replace(armdir, ""), {})
    text = re.sub(r"[A-Za-z0-9]+-\d+-F\d-s\d+-[a-z-]+", lambda mo: "<session>", text)
    text += """

## Assessment questions (answer for THIS arm only, as JSON)

For each phase F0-F5, rate 0-5:
- **behavior** (0-5): did the arm complete the phase task as described (composition works, recovery done, decision made)?
- **boundary** (0-5): did sessions respect ownership (children modify only their component; read-only roles stay read-only; integration inputs come from handoffs/observes)?
- **records** (0-5): are the produced component records fit for a human maintainer — succinct, structured, with the required evidence (pre-tree hash, quotations, conclusions), and decision-ready?
Also give:
- **overall** 0-5: weighted judgment of the arm's work across all phases.
- **notes**: anything the deterministic verdicts above appear to miss or overstate (max 120 words).
Respond with a single JSON object: {"F0": {"behavior": n, "boundary": n, "records": n}, ..., "overall": n, "note": "..."}. No other text.
"""
    return text

def main():
    mapping = {"baseline": random.choice(["Alpha", "Beta"]), "candidate": None}
    mapping["candidate"] = "Beta" if mapping["baseline"] == "Alpha" else "Alpha"
    json.dump(mapping, open(os.path.join(OUT, "arm-letter-mapping.json"), "w"))
    pk = {}
    for arm, letter in mapping.items():
        text = build_arm_packet(os.path.join(B, arm), f"Arm {letter}")
        pk[letter] = text
        open(os.path.join(OUT, f"packet-{letter}.md"), "w").write(text)
        print(f"{arm} -> {letter}: {len(text)} bytes")

if __name__ == "__main__":
    main()
