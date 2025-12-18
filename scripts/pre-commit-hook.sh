#!/bin/bash

# Pre-commit hook for checking translation completeness
echo "🔍 Checking translation completeness..."

# Try to find node command
# First, try to load nvm if it exists
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Find node executable
NODE_CMD=$(command -v node 2>/dev/null)

if [ -z "$NODE_CMD" ]; then
  echo "❌ Error: node command not found"
  echo "Please ensure Node.js is installed and available in your PATH"
  exit 1
fi

# Run the translation check script
$NODE_CMD scripts/check-translations.js

# Check the exit code
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Pre-commit failed: Translation check failed"
    echo "Please fix the missing translation keys before committing."
    exit 1
fi

echo "✅ Translation check passed!" 