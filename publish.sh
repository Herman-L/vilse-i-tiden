#!/bin/sh

# Clean the dist and static directories
[ -d static/timer ] && rm -r static/timer; mkdir static/timer
[ -d dist ] && rm -r dist; mkdir dist

# Build the display
npm install
npm run build

# Copy the static files
cp -r static config.json segments_*.json dist

for platform in linux-x{32,64} mac-x64 windows-x{32,64}; do
    npx nexe src/main.js -t "$platform-12.15.0" -o "dist/vilse-i-tiden-$platform"
done

cd dist && zip -9 -r ../vilse-i-tiden.zip .
