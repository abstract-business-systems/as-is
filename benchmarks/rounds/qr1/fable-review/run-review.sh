#!/bin/bash
# usage: run-review.sh <review-file> <result-file>
key=$(python3 -c "
import json
d=json.load(open('/home/vc/.pi/agent/auth.json'))
print(d.get('openrouter',{}).get('api_key') or d.get('openrouter',{}).get('key',''))
")
python3 - "$1" "$2" "$key" <<'PY'
import json,sys,urllib.request
review_file,result_file,key=sys.argv[1],sys.argv[2],sys.argv[3]
def rd(p):
    return open(p).read()
context_parts=[
 '\n\n===== DRAFT.2 (FINDINGS LEDGER + FULL AMENDED PROTOCOL) =====\n\n'+rd('/tmp/sol-revision/ledger.md'),
 '\n\n===== REVIEW 1 (yours) =====\n\n'+rd('/tmp/fable-review/review1-result.md'),
 '\n\n===== REVIEW 2 (yours) =====\n\n'+rd('/tmp/fable-review/review2-result.md'),
]
task=rd(review_file)
system=("You are an independent external reviewer of a benchmark protocol draft authored by GPT-5.6 Sol. "
 "You are from a different model family; provide genuinely independent judgment and do not defer to the author or to prior reviews. "
 "You are read-only and advisory; your findings carry no execution authority.")
body=json.dumps({
 "model":"anthropic/claude-fable-5.1",
 "max_tokens":40000,
 "messages":[{"role":"system","content":system},
             {"role":"user","content":task+"\n\n===== PROTOCOL DRAFT UNDER REVIEW =====\n\n"+''.join(context_parts)}],
}).encode()
req=urllib.request.Request('https://openrouter.ai/api/v1/chat/completions',data=body,
 headers={'Authorization':f'Bearer {key}','Content-Type':'application/json'})
with urllib.request.urlopen(req,timeout=900) as r:
    d=json.load(r)
text=d['choices'][0]['message']['content']
usage=d.get('usage',{})
open(result_file,'w').write(text+f"\n\n===== USAGE =====\n{json.dumps(usage)}\n")
print('written',result_file,'usage',usage.get('prompt_tokens'),usage.get('completion_tokens'))
PY
