#!/usr/bin/env bash
# Setup script for the Fight the Landlord project

set -e

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not installed. Please install Node.js and npm first." >&2
  exit 1
fi

REQUIRED_MAJOR=20
CURRENT="$(node -v)"
MAJOR="${CURRENT#v}"
MAJOR="${MAJOR%%.*}"
if [ "$MAJOR" -lt "$REQUIRED_MAJOR" ]; then
  echo "Node.js $REQUIRED_MAJOR+ is required. Current version: $CURRENT" >&2
  exit 1
fi

echo "Installing npm dependencies..."
npm install

echo "Running tests..."
npm test

echo "Setup complete! Run 'npm start' to launch the development server."

