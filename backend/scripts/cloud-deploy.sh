#!/usr/bin/env bash
# Laravel Cloud deploy command. Migrations only — filesystem changes here are discarded.
set -euo pipefail

cd "$(dirname "$0")/.."

php artisan migrate --force
