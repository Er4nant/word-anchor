#!/usr/bin/env bash
# Builds Chrome and Firefox store zips from the source files.
# Run from the word-anchor/ directory: ./build.sh
set -euo pipefail

DIST="dist"
rm -rf "$DIST"
mkdir -p "$DIST/chrome" "$DIST/firefox"

SHARED_FILES="background.js content.js icon16.png icon48.png icon128.png popup.html popup.js LICENSE"

# Chrome build: uses manifest.json as-is (service_worker)
cp $SHARED_FILES "$DIST/chrome/"
cp manifest.json "$DIST/chrome/manifest.json"

# Firefox build: swaps in manifest.firefox.json (scripts)
cp $SHARED_FILES "$DIST/firefox/"
cp manifest.firefox.json "$DIST/firefox/manifest.json"

cd "$DIST/chrome" && zip -r -X ../wordanchor-chrome.zip . -x ".*" && cd ../..
cd "$DIST/firefox" && zip -r -X ../wordanchor-firefox.zip . -x ".*" && cd ../..

echo "Built:"
echo "  $DIST/wordanchor-chrome.zip"
echo "  $DIST/wordanchor-firefox.zip"
