#!/bin/bash

# Set up git configuration
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create branches
git checkout -b dev
git checkout -b feature/initial-setup

# Add files to staging
git add .

# Initial commit
git commit -m "chore: initial project setup with foundational files"

echo "Git setup complete! Remember to:"
echo "1. Replace placeholder user details in git config"
echo "2. Create a GitHub repository and add remote"
echo "3. Push branches to remote using: git push -u origin --all"