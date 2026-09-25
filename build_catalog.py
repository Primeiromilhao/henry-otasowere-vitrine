import json,re
from pathlib import Path
base=Path(__file__).parent
rows=[]
seen=set()
cats=[("maldi", "Maldições e Família"),("padrão familiar","Maldições e Família"),("família","Maldições e Família"),("altar","Altar"),("oração","Oração"),("orando","Oração"),("cura","Cura e Milagres"),("milagre","Cura e Milagres"),("libertação","Libertação"),("fé","Fé"),("bênção","Bênçãos"),("profético","Profético"),("ressurreição","Cura e Milagres"),("espírito santo","Espírito Santo"),("família","Família"),("relacionamento","Família e Relacionamentos")]
def category(t):
    s=t.lower()
    for k,v in cats:
        if k in s:return v
    return "Ensino e Pregação"
for line in (base/"youtube_channel_results.txt").read_text(encoding="utf-8",errors="replace").splitlines():
    p=line.split("|",5)
    if len(p)!=6: continue
    vid,title,date,duration,channel,url=p
    if not vid or vid in seen: continue
    seen.add(vid)
    mins=""
    if duration and duration.isdigit():
        n=int(duration); mins=f"{n//60}:{n%60:02d}"
    rows.append({"id":vid,"title":title,"channel":channel,"url":url,"platform":"youtube","category":category(title),"thumbnail":f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg","duration":mins,"upload_date":date})
(base/"videos.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding="utf-8")
print("catalogo:",len(rows))
