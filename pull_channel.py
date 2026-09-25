import subprocess,sys
from pathlib import Path
u="https://www."+"youtube.com/channel/"+"UCamDR5bQnSDBo5ylGvf3VHQ/videos"
out=Path("youtube_channel_results.txt")
args=["yt-dlp","--flat-playlist","--print","%(id)s|%(title)s|%(upload_date)s|%(duration)s|%(channel)s|%(webpage_url)s",u]
with out.open("w",encoding="utf-8") as f:
    subprocess.run(args,stdout=f,stderr=subprocess.DEVNULL,check=False)
print(out)
