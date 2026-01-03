$apps = @(
    @{ Path = "UPH-main"; Name = "UPH (Project Hub)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm start -p 3001 }" },
    @{ Path = "t-Market"; Name = "t-Market (Store)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm start -p 3002 }" }
)

Write-Host "Starting UPH and t-Market in PRODUCTION Mode..." -ForegroundColor Magenta

foreach ($app in $apps) {
    if (Test-Path $app.Path) {
        Write-Host "Launching Build & Start for $($app.Name)..." -ForegroundColor Cyan
        $command = "cd '$($app.Path)'; Write-Host 'Building $($app.Name)...'; " + $app.Cmd
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    }
    else {
        Write-Host "Warning: Path not found for $($app.Name) ($($app.Path))" -ForegroundColor Yellow
    }
}
