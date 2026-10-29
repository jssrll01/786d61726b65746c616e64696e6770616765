#!/bin/sh
# Usage: sh scripts/extract-frames.sh
#   ONLY=m  phone set only (portrait crop)     ONLY=d  desktop set only
#   FPS=24 to override (default: the video's own fps, capped by MAXFPS=30)
#   Q=82  DW=1920  MH=1440  FX=0.5
# No denoise, no sharpen, no blending: every frame is the real frame.
set -e
URL="${URL:-https://res.cloudinary.com/bvw3okdf/video/upload/v1793197102/New_Project_20F7837.mp4}"
Q="${Q:-82}"; DW="${DW:-1920}"; MH="${MH:-1440}"; FX="${FX:-0.5}"; ONLY="${ONLY:-all}"; MAXFPS="${MAXFPS:-30}"
command -v ffmpeg >/dev/null 2>&1 || { echo "ERROR: ffmpeg not installed. Alpine: apk add ffmpeg"; exit 1; }
mkdir -p tmp
if [ ! -s tmp/source.mp4 ]; then
  command -v curl >/dev/null 2>&1 || { echo "ERROR: curl not installed. Alpine: apk add curl"; exit 1; }
  curl -fL "$URL" -o tmp/source.mp4 || { echo "ERROR: download failed."; exit 1; }
fi
probe() { ffprobe -v error -select_streams v:0 -show_entries "stream=$1" -of csv=p=0 tmp/source.mp4 2>/dev/null | head -1; }
SRCW=$(probe width); SRCH=$(probe height); AFR=$(probe avg_frame_rate)
SRC=$(echo "$AFR" | awk -F/ '{ if ($2 > 0) printf "%d", $1 / $2 + 0.5; else printf "%d", $1 + 0.5 }')
[ -n "$SRC" ] && [ "$SRC" -gt 0 ] || SRC=30
[ "$SRC" -gt "$MAXFPS" ] && SRC=$MAXFPS
FPS="${FPS:-$SRC}"
echo "Source: ${SRCW}x${SRCH} at ${AFR} fps. Extracting at ${FPS} fps."
SC="flags=lanczos+accurate_rnd+full_chroma_int"
mk() {
  rm -rf "public/$1"; mkdir -p "public/$1"
  ffmpeg -y -loglevel error -i tmp/source.mp4 -an -vf "$2" -c:v libwebp -q:v "$Q" -compression_level 4 "public/$1/f%04d.webp"
  COUNT=$(ls public/$1/*.webp 2>/dev/null | wc -l | tr -d ' ')
  [ "$COUNT" -gt 0 ] || { echo "ERROR: no frames exported to $1"; exit 1; }
  echo "{\"count\":$COUNT,\"fps\":$FPS}" > "public/$1/manifest.json"
  echo "OK: $COUNT frames in public/$1 ($(du -sh public/$1 | cut -f1))"
}
if [ "$ONLY" != "d" ]; then
  mk frames-m "fps=${FPS},crop=min(iw\,trunc(ih*9/16/2)*2):ih:(iw-min(iw\,trunc(ih*9/16/2)*2))*${FX}:0,scale=-2:min(ih\,${MH}):${SC}"
fi
if [ "$ONLY" != "m" ]; then
  mk frames "fps=${FPS},scale=min(iw\,${DW}):-2:${SC}"
fi
