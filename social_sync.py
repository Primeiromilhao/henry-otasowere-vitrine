import json, subprocess, re, html
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
STATE = ROOT / "social-monitor-state.json"
SOURCES = [
 {"key":"youtube-vozdacura","platform":"youtube","url":"https://www.youtube.com/@Vozdacura","catalog":"videos.json","channel":"Vozdacura","channel_url":"https://www.youtube.com/@Vozdacura"},
 {"key":"facebook-vozdacura","platform":"facebook","url":"https://www.facebook.com/ministeriodavozdacura/videos/","catalog":"videos-facebook.json","channel":"Ministerio Vozdacura","channel_url":"https://www.facebook.com/ministeriodavozdacura/"},
 {"key":"facebook-meetprophet","platform":"facebook","url":"https://www.facebook.com/Imeetprophet/videos/","catalog":"videos-facebook.json","channel":"Meetprophet","channel_url":"https://www.facebook.com/Imeetprophet/"},
 {"key":"tiktok-vozdacura","platform":"tiktok","url":"https://www.tiktok.com/@ministeriovozdacura","catalog":"videos-tiktok.json","channel":"Ministério Voz da Cura","channel_url":"https://www.tiktok.com/@ministeriovozdacura"}
]

def run(cmd):
 p=subprocess.run(cmd,capture_output=True,text=True,encoding="utf-8",errors="replace")
 if p.returncode: raise RuntimeError(p.stderr[-2000:] or "command failed")
 return p.stdout

def yt_items(url, platform):
 data=json.loads(run(["yt-dlp","--flat-playlist","--playlist-end","100","--dump-single-json","--skip-download",url]))
 items=[]
 for e in data.get("entries") or []:
  if not e or not e.get("id"): continue
  vid=str(e["id"])
  page=e.get("webpage_url") or (f"https://www.youtube.com/watch?v={vid}" if platform=="youtube" else f"https://www.tiktok.com/@ministeriovozdacura/video/{vid}")
  items.append({"id":vid,"title":e.get("title") or f"Vídeo {vid}","thumbnail":e.get("thumbnail") or "","url":page,"platform":platform})
 return items

def fb_items(url, channel, channel_url):
 req=Request(url,headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"})
 text=urlopen(req,timeout=30).read().decode("utf-8","replace")
 found={}
 for pat in [
  r'href=["\'](https://www\.facebook\.com/[^"\']*/videos/(?:[^"\']*/)?(\d+)[^"\']*)["\']',
  r'href=["\'](/[^"\']+/videos/(?:[^"\']*/)?(\d+)[^"\']*)["\']'
 ]:
  for m in re.finditer(pat,text,re.I):
   u=("https://www.facebook.com"+m.group(1)) if m.group(1).startswith("/") else m.group(1)
   if "reel" not in u.lower(): found[m.group(2)]=html.unescape(u).replace("\\/","/")
 out=[]
 for vid,u in found.items():
  out.append({"id":vid,"title":f"Vídeo Facebook {vid}","thumbnail":"","url":u,"platform":"facebook","category":"Vídeos","channel":channel,"channel_url":channel_url})
 return out

def load(path, default):
 try: return json.loads(path.read_text(encoding="utf-8-sig"))
 except: return default

state=load(STATE,{"initialized":False,"ids":{}})
total=0
for src in SOURCES:
 try:
  items=fb_items(src["url"],src["channel"],src["channel_url"]) if src["platform"]=="facebook" else yt_items(src["url"],src["platform"])
  ids={str(x["id"]) for x in items}
  if not state.get("initialized"):
   state.setdefault("ids",{})[src["key"]]=sorted(ids)
   print(f"BOOTSTRAP {src['key']}: {len(ids)} current videos recorded; none imported")
   continue
  seen=set(state.setdefault("ids",{}).get(src["key"],[]))
  new=[x for x in items if str(x["id"]) not in seen]
  if new:
   catalog=ROOT/src["catalog"]
   arr=load(catalog,[])
   existing={str(x.get("id")) for x in arr}
   for x in reversed(new):
    if str(x["id"]) not in existing:
     arr.insert(0,x); existing.add(str(x["id"])); total+=1
   catalog.write_text(json.dumps(arr,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
   state["ids"][src["key"]]=sorted(seen|{str(x["id"]) for x in new})
   print(f"NEW {src['key']}: {len(new)}")
  else: print(f"NO_NEW {src['key']}")
 except Exception as e: print(f"ERROR {src['key']}: {e}")
if not state.get("initialized"): state["initialized"]=True
STATE.write_text(json.dumps(state,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"TOTAL_NEW={total}")
