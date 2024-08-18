#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "No arguments supplied."
  exit 1
fi

cat .env.docker-compose > .env

IFS=',' read -r -a profiles <<< "$1"

for profile in "${profiles[@]}"; do
  if [ -e "$profile/.env" ]; then
    cat "$profile/.env" >> .env
  else
    echo "$profile/.env not found."
  fi
done

echo COMPOSE_PROFILES="$1" >> .env
