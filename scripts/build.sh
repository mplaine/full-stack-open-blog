#!/bin/bash

echo "Build script"

# Install dependencies
npm run install:frontend
npm run install:backend

# Build for production
npm run build:frontend
