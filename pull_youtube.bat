@echo off
setlocal
set OUT=youtube_results.txt
del "%OUT%" 2>nul
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere Voz da Cura Network" >> "%OUT%"
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere generational curses" >> "%OUT%"
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere family curses" >> "%OUT%"
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere family altar" >> "%OUT%"
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere deliverance" >> "%OUT%"
yt-dlp --flat-playlist --print "%%(title)s|%%(uploader)s|%%(webpage_url)s" "ytsearch20:Henry Otasowere prayer" >> "%OUT%"
endlocal
