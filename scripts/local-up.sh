#!/usr/bin/env bash
set -eu
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

if [[ ! -f .env ]]; then
  if [[ ! -f .env.example ]]; then
    echo "Не найден .env.example в корне репозитория." >&2
    exit 1
  fi
  cp .env.example .env
  echo "Создан .env из .env.example — при необходимости отредактируйте и перезапустите."
fi

docker compose up --build "$@"
