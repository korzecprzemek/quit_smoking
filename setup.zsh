#!/bin/zsh

echo "Setting up Puffless..."

mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/services
mkdir -p frontend/src/assets

mkdir -p backend/app/api
mkdir -p backend/app/models
mkdir -p backend/app/schemas
mkdir -p backend/app/services
mkdir -p backend/app/db

touch README.md
touch .gitignore
touch docker-compose.yml

echo "Puffless structure created!"