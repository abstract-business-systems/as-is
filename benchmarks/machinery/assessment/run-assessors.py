#!/usr/bin/env python3
# QR2 assessor invocation (round-1 pattern). Model-level scores preserved; roles annotated.
import json, os, re, sys, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "ratings")
os.makedirs(OUT, exist_ok=True)

def find_key(d):
    if isinstance(d, dict):
        for k, v in d.items():
            if k == "key" and isinstance(v, str) and v.startswith("sk-or-"):
                return v
            r = find_key(v)
            if r: return r
    elif isinstance(d, list):
        for v in d:
            r = find_key(v)
            if r: return r
    else:
        if isinstance(d, str) and d.startswith("sk-or-"):
            return d
    return None

KEY = find_key(json.load(open("/home/vc/.pi/agent/auth.json")))

def call(model, packet, session_tag, max_retries=6):
    body = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a blinded benchmark assessor. Rate the arm packet strictly per the question set at the end. Answer with the single JSON object requested."},
            {"role": "user", "content": packet},
        ],
    }).encode()
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=body, headers={
        "Authorization": f"Bearer {KEY}", "Content-Type": "application/json",
        "x-session-id": session_tag, "x-session-affinity": session_tag,
    })
    for attempt in range(max_retries := max_retries):
        try:
            with urllib.request.urlopen(req, timeout=600) as resp:
                out = json.loads(resp.read())
            c = out["choices"][0]["message"]["content"]
            cost = (out.get("usage") or {}).get("cost")
            return c, cost
        except Exception as e:
            print(f"  retry {attempt+1}: {e}", flush=True)
            time.sleep(20 + 30 * attempt)
    return None, None

def parse_json(text):
    if not text: return None
    m = re.search(r"\{.*\}", text, re.S)
    if not m: return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None

MODELS = {
    "kimi":  {"id": "moonshotai/kimi-k2.6", "roles": ["blind assessor (deciding pair)"]},
    "glm":   {"id": "z-ai/glm-5.3",        "roles": ["blind assessor (deciding pair)"]},
    "grok":  {"id": "x-ai/grok-4.6",       "roles": ["assessor; also protocol/fixture/wrapper reviewer — reported separately from deciding median"]},
    "sol":   {"id": "openai/gpt-5.6-sol",  "roles": ["author of the candidate instruction — labeled author-analysis, never a blind scorer"]},
}

def main():
    which = sys.argv[1:] or ["kimi", "glm"]
    packets = {L: open(os.path.join(HERE, "packets", f"packet-{L}.md")).read() for L in ("Alpha", "Beta")}
    for name in which:
        spec = MODELS[name]
        model = spec.get("id") or spec["id"]
        tag = f"ccq-r2-assess-{name}"
        res = {}
        for L in ("Alpha", "Beta"):
            print(f"[{name}] scoring {L}...", flush=True)
            raw, cost = call(model, packets[L], tag + "-" + L.lower())
            res[L] = {"raw": raw, "cost": cost, "parsed": parse_json(raw)}
            print(f"[{name}] {L}: parsed={'yes' if res[L]['parsed'] else 'NO'} cost=${cost or 0:.4f}", flush=True)
        json.dump({"model": model, "roles": spec["roles"], "session_tag": tag, "ratings": res},
                  open(os.path.join(OUT, f"{name}.json"), "w"), indent=1)

if __name__ == "__main__":
    main()
