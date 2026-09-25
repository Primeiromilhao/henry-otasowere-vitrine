@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
yt-dlp --flat-playlist --print "%%(channel)s|%%(channel_id)s|%%(channel_url)s" "ytsearch5:Vozdacura Henry Otasowere"
