$apps = @(
    @{ Path = "ENV-I-main"; Name = "ENV-I (Inventory)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm start }" },
    @{ Path = "UPH-main"; Name = "UPH (Project Hub)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm start -p 3001 }" },
    @{ Path = "t-Market"; Name = "t-Market (Store)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm start -p 3002 }" },
    @{ Path = "Weave-main"; Name = "Weave (Architect)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm preview --port 3004 }" },
    @{ Path = "T-SA\code"; Name = "T-SA (Analyzer)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm preview --port 5173 }" },
    @{ Path = "Renderci\code"; Name = "Renderci (AI Visualizer)"; Cmd = "pnpm build; if (`$LASTEXITCODE -eq 0) { pnpm preview --port 5174 }" }
)

Write-Host "Starting T-Ecosystem Applications in PRODUCTION Mode (Build + Start)..." -ForegroundColor Magenta
Write-Host "This process may take a few minutes as each application needs to compile." -ForegroundColor Yellow

foreach ($app in $apps) {
    if (Test-Path $app.Path) {
        Write-Host "Launching Build & Start for $($app.Name)..." -ForegroundColor Cyan
        
        # Construct the command string.
        # escaped $LASTEXITCODE (`$LASTEXITCODE) in the Cmd strings above ensures it is NOT expanded by the parent shell.
        # It allows the child shell to receive the literal string '$LASTEXITCODE' and evaluate it.
        $command = "cd '$($app.Path)'; Write-Host 'Building $($app.Name)...'; " + $app.Cmd
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    }
    else {
        Write-Host "Warning: Path not found for $($app.Name) ($($app.Path))" -ForegroundColor Yellow
    }
}

Write-Host "All production launch commands issued." -ForegroundColor Green
