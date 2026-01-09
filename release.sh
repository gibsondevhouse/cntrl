#!/bin/bash
# CNTRL RELEASE BUNDLER
# Creates a clean backup of the storyteller engine.

VERSION="2.0.0"
OUTPUT="cntrl_v${VERSION}_$(date +%Y%m%d).tar.gz"

echo ">> Preparing Release v$VERSION..."

# 1. Build everything
echo ">> Building Core..."
cd _cntrl
npm run build
echo ">> Building Dashboard..."
cd dashboard
npm run build
cd ../..

# 2. Bundle
echo ">> Creating archive: $OUTPUT"
# Exclude node_modules, logs, and temp test files
tar --exclude='_cntrl/node_modules' \
    --exclude='_cntrl/dashboard/node_modules' \
    --exclude='_cntrl/logs/*' \
    --exclude='_cntrl/tests/test_novel_root' \
    --exclude='.git' \
    -czf $OUTPUT _cntrl novel code launch_cntrl.sh MANIFEST.md README.md GEMINI.md

echo ">> Done. Portable lab compressed to $OUTPUT"

