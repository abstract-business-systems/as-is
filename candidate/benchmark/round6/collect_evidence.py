#!/usr/bin/env python3
"""Round-6 evidence collection, stage 1: session stores + status reports.

Reads the launcher registry, locates host session stores by localSessionId,
copies them into results/<uc>/<arm>/ (top + nested), and extracts each
session's final assistant message as a status report.
"""
import glob
import json
import os
import re
import shutil
import sys

HOST = os.path.abspath(sys.argv[1])
RES = os.path.abspath(sys.argv[2])


def load_jobs():
    """Registry launch records -> round-5 job list with results destinations."""
    jobs = {}
    for line in open('/tmp/as-is-jobs.jsonl'):
        try:
            e = json.loads(line)
        except Exception:
            continue
        if e.get('event') != 'launched':
            continue
        name = e.get('sessionName') or ''
        if not name.startswith('round6-'):
            continue
        RUN2_PARENTS = {'j-mthsg3zm-wn2kt2', 'j-mthsgjti-qyxnec', 'j-mthsh0kv-5oelc3', 'j-mthshgrx-rmujbx'}
        if e.get('jobId') not in RUN2_PARENTS and e.get('parentJobId') not in RUN2_PARENTS:
            continue
        jobs[e['jobId']] = {
            'name': name,
            'localSessionId': e.get('localSessionId'),
            'parentJobId': e.get('parentJobId'),
            'dest': None,
        }
    for jid, j in jobs.items():
        m = re.match(r'round6-(uc\d+)-(baseline|candidate)$', j['name'])
        if m:
            j['dest'] = os.path.join(RES, m.group(1), m.group(2))
    for jid, j in jobs.items():
        if j.get('dest'):
            continue
        pj = j.get('parentJobId')
        hops = 0
        while pj in jobs and not jobs[pj].get('dest') and hops < 10:
            pj = jobs[pj].get('parentJobId')
            hops += 1
        if pj and jobs[pj].get('dest'):
            suffix = re.sub(r'[^A-Za-z0-9._-]', '-', j['name'].replace('round6-', ''))
            j['dest'] = os.path.join(jobs[pj]['dest'], 'nested-' + suffix)
    return jobs


def build_session_index(host):
    """localSessionId -> host session file path."""
    ids = {}
    pattern = os.path.join(host, '.as-is', 'subagents', 'sessions', '*.jsonl')
    for f in glob.glob(pattern):
        try:
            fh = open(f)
        except OSError:
            continue
        with fh:
            for line in fh:
                if '"type": "session"' not in line and '"type":"session"' not in line:
                    continue
                try:
                    e = json.loads(line)
                except Exception:
                    continue
                if e.get('type') == 'session' and e.get('id'):
                    ids[e['id']] = f
                    break
    return ids


def final_assistant_text(path):
    """Return the last non-empty assistant message text (the status report)."""
    last = None
    for line in open(path):
        try:
            e = json.loads(line)
        except Exception:
            continue
        if e.get('type') != 'message':
            continue
        m = e.get('message') or {}
        if m.get('role') != 'assistant':
            continue
        parts = m.get('content')
        if isinstance(parts, list):
            text = '\n'.join(
                p.get('text', '') for p in parts
                if isinstance(p, dict) and p.get('type') == 'text'
            )
        else:
            text = parts or ''
        if text.strip():
            last = text
    return last


def main():
    jobs = load_jobs()
    id_map = build_session_index(HOST)
    count = 0
    for jid, j in sorted(jobs.items()):
        dest = j.get('dest')
        if not dest:
            print(f"WARN no dest for {jid} ({j['name']})")
            continue
        os.makedirs(dest, exist_ok=True)
        if j['name'].endswith(('-baseline', '-candidate')):
            suffix = 'top'
        else:
            suffix = 'nested-' + re.sub(r'[^A-Za-z0-9._-]', '-', j['name'].replace('round6-', ''))
        store = os.path.join(dest, 'session-store-' + suffix + '.jsonl')
        src = id_map.get(j.get('localSessionId'))
        if src:
            shutil.copy(src, store)
            report = final_assistant_text(src) or '(no assistant text found)\n'
            with open(os.path.join(dest, 'status-report-' + suffix + '.md'), 'w') as out:
                out.write(report)
            print(f"{j['name']} -> {os.path.relpath(store, RES)}")
            count += 1
        else:
            print(f"WARN no host session for {j['name']} localSessionId={j.get('localSessionId')}")
    print(f"collected stores for {len(jobs)} registry jobs")


if __name__ == '__main__':
    main()
