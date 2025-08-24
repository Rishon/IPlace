#!/bin/bash

# Build Project
echo "Building project..."
spacetime build

# Publish the project
spacetime publish -y -s self-host -c iplace-live

# Generate the build files
spacetime generate --out-dir ../client/src/module_bindings/ --lang ts

echo "Build complete"