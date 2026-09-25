import json
from pathlib import Path
for p in [Path(r"F:\Henry_Otasowere_Videos_Vitrine\videos.json"),Path(r"C:\Users\Utilizador\Desktop\Henry\Henry Otasowere bot youtu.be\vitrine\videos.json")]:
    data=json.loads(p.read_text(encoding="utf-8"))
    for v in data:
        vid=v.get("id","").strip()
        v["channel"]="Vozdacura"
        v["channel_url"]="https://www.youtube.com/@Vozdacura"
        if vid:
            v["url"]="https://www.youtube.com/watch?v="+vid
            v["thumbnail"]="https://i.ytimg.com/vi/"+vid+"/hqdefault.jpg"
    p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
print("corrigidos")
