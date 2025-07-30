#!/bin/bash

# Get commit message from argument or use default
COMMIT_MSG=${1:-"Auto commit on $(date '+%Y-%m-%d %H:%M:%S')"}

# Get current branch name
BRANCH=$(git symbolic-ref --short HEAD)

echo "📦 Adding all changes..."
git add .

echo "📝 Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

echo "🚀 Pushing to GitHub on branch '$BRANCH'..."

# Check if branch has upstream
UPSTREAM=$(git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "🔗 No upstream found. Setting upstream to origin/$BRANCH"
  git push --set-upstream origin "$BRANCH"
else
  git push
fi

echo "✅ Done!"

# chmod +x push.sh