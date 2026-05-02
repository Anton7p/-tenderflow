$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$envFile = Join-Path $repoRoot '.env'
$example = Join-Path $repoRoot '.env.example'
if (-not (Test-Path $envFile)) {
    if (-not (Test-Path $example)) {
        Write-Error "Не найден .env.example в корне репозитория."
    }
    Copy-Item $example $envFile
    Write-Host "Создан .env из .env.example — при необходимости отредактируйте и перезапустите."
}

docker compose up --build @args
