#!/bin/sh
set -eu
render_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
render_tmp=$(mktemp -d)
trap 'rm -rf "$render_tmp"' EXIT HUP INT TERM
google-chrome --headless=new --no-sandbox --disable-gpu \
  --disable-background-networking --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1024,1024 \
  --screenshot="$render_tmp/page.png" "file://$render_root/tools/entry.html"
convert "$render_tmp/page.png" -strip -colors 256 "PNG8:$render_tmp/entry.png"
mkdir -p "$render_root/assets"
cp "$render_tmp/entry.png" "$render_root/assets/entry.png"
