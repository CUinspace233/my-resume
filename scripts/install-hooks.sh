#!/bin/bash

# Install pre-commit hooks
echo "📦 Installing pre-commit hooks..."

# Make sure the script is executable
chmod +x scripts/pre-commit-hook.sh

# Copy the pre-commit hook to git hooks directory
if [ -d .git/hooks ]; then
    cp scripts/pre-commit-hook.sh .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook installed successfully!"
else
    echo "❌ Git repository not found. Please run this script in a git repository."
    exit 1
fi 