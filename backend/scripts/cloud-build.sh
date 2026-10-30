#!/usr/bin/env bash
# Laravel Cloud build command. Working directory is backend/.
set -euo pipefail

cd "$(dirname "$0")/.."

composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Vite and TypeScript live in devDependencies. Install them even if NODE_ENV=production.
npm ci --prefix ../frontend --include=dev --audit false
npm run build --prefix ../frontend

php artisan optimize
