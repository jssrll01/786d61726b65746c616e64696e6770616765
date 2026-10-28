#!/bin/sh
# Run from the project folder:  sh scripts/extract-frames.sh [video-url]
# Options: FPS=12 WIDTH=960 Q=68
set -e
URL="${1:-https://res.cloudinary.com/bvw3okdf/video/upload/v1793197102/New_Project_20F7837.mp4}"
FPS="${FPS:-12}"; WIDTH="${WIDTH:-960}"; Q="${Q:-68}"
command -v ffmpeg >/dev/null 2>&1 || { echo "ERROR: ffmpeg not installed. Alpine: apk add ffmpeg"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "ERROR: curl not installed. Alpine: apk add curl"; exit 1; }
mkdir -p tmp public/frames
rm -f public/frames/*.webp public/frames/manifest.json
echo "Downloading source..."
curl -fL "$URL" -o tmp/source.mp4 || { echo "ERROR: download failed. Check the URL and that the asset is public."; exit 1; }
echo "Extracting frames at ${FPS}fps, width ${WIDTH}, quality ${Q}..."
ffmpeg -y -loglevel error -i tmp/source.mp4 -an -vf "fps=${FPS},scale=${WIDTH}:-2" -c:v libwebp -q:v "$Q" public/frames/f%04d.webp
COUNT=$(ls public/frames/*.webp 2>/dev/null | wc -l | tr -d ' ')
[ "$COUNT" -gt 0 ] || { echo "ERROR: no frames were exported."; exit 1; }
echo "{\"count\":$COUNT,\"fps\":$FPS,\"width\":$WIDTH}" > public/frames/manifest.json
echo "OK: $COUNT frames written to public/frames/"
