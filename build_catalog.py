import json, re
from pathlib import Path
from datetime import datetime

base = Path(__file__).parent
rows = []
seen = set()

RULES = [
    ("altar de incenso", "Altar"), ("altar", "Altar"), ("sacrifício", "Altar"),
    ("oração", "Oração"), ("orando", "Oração"),
    ("cura", "Cura e Milagres"), ("milagre", "Cura e Milagres"), ("ressurreição", "Cura e Milagres"),
    ("libertação", "Libertação"),
    ("maldição", "Maldições e Família"), ("padrão familiar", "Maldições e Família"),
    ("família", "Família e Relacionamentos"), ("relacionamento", "Família e Relacionamentos"),
    ("fé", "Fé"), ("profético", "Profético"), ("profecia", "Profético"),
    ("espírito santo", "Espírito Santo"), ("unção", "Unção e Óleo"), ("óleo ungido", "Unção e Óleo"),
    ("bênção", "Bênçãos"),
]

def segment(text):
    s = (text or "").casefold()
    for key, value in RULES:
        if key in s:
            return value
    return "Ensino e Pregação"

def iso_date(value):
    value = (value or "").strip()
    if re.fullmatch(r"\\d{8}", value):
        return f"{value[:4]}-{value[4:6]}-{value[6:8]}T00:00:00Z"
    return None

src = base / "youtube_channel_results.txt"
for line in src.read_text(encoding="utf-8", errors="replace").splitlines():
    p = line.split("|", 5)
    if len(p) != 6:
        continue
    vid, title, date, duration, channel, url = p
    if not vid or vid in seen:
        continue
    seen.add(vid)
    mins = ""
    if duration and duration.isdigit():
        n = int(duration)
        mins = f"{n//60}:{n%60:02d}"
    published_at = iso_date(date)
    rows.append({
        "id": vid,
        "title": title,
        "channel": channel,
        "url": url,
        "platform": "youtube",
        "segment": segment(title),
        "category": segment(title),
        "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        "duration": mins,
        "upload_date": date,
        "published_at": published_at,
        "verified_source": True,
    })

# Preserve any manually/automatically collected social records.
social_path = base / "social_catalog.json"
if social_path.exists():
    try:
        social = json.loads(social_path.read_text(encoding="utf-8"))
        for item in social:
            key = f"{item.get('platform')}:{item.get('id') or item.get('url')}"
            if item.get("url") and key not in seen:
                item.setdefault("segment", segment(item.get("title", "")))
                item.setdefault("category", item["segment"])
                item.setdefault("verified_source", False)
                rows.append(item)
                seen.add(key)
    except Exception as exc:
        print("Aviso: social_catalog.json não pôde ser lido:", exc)

rows.sort(key=lambda x: x.get("published_at") or x.get("upload_date") or "", reverse=True)
(base / "videos.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
print("catalogo_unificado:", len(rows))
print("por_plataforma:", {p: sum(1 for x in rows if x.get('platform') == p) for p in ('youtube','facebook','instagram','tiktok')})
print("por_segmento:", {s: sum(1 for x in rows if x.get('segment') == s) for s in sorted({x.get('segment') for x in rows})})
