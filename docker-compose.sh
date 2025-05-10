#!/usr/bin/env bash

# Read environment variables from a file.
function read_env() {
  \grep -v '^#' "$1" | sed -E -e 's/ +#.*//' | xargs
}

# Resolve environment variables including variables from a file.
# example: `MAIL_FROM_NAME="${APP_NAME}"`
function resolve_env() {
  export $(read_env "$1")
  eval export $(read_env "$1")
}

resolve_env ".env.docker-compose"

resolve_env "./backend/.env" &&
  docker compose \
    -f docker-compose.base.yml \
    -f docker-compose.backend.base.yml \
    -f docker-compose.backend.dev.yml \
    -f docker-compose.frontend.base.yml \
    -f docker-compose.frontend.dev.yml \
    --profile backend \
    --profile frontend \
    "$@"
