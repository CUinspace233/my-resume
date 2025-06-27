#!/bin/bash

# Pre-commit hook for checking translation completeness
echo "🔍 Checking translation completeness..."

# Run the translation check script
node scripts/check-translations.js

# Check the exit code
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Pre-commit failed: Translation check failed"
    echo "Please fix the missing translation keys before committing."
    exit 1
fi

echo "✅ Translation check passed!" 