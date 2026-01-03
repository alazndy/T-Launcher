$apps = @(
    @{ Path = "ENV-I-main"; Name = "ENV-I (Inventory)" },
    @{ Path = "UPH-main"; Name = "UPH (Project Hub)" },
    @{ Path = "Weave-main"; Name = "Weave (Architect)" },
    @{ Path = "t-Market"; Name = "t-Market (Store)" },
    @{ Path = "T-SA\code"; Name = "T-SA (Analyzer)" },
    @{ Path = "Renderci\code"; Name = "Renderci (AI Visualizer)" }
)

Write-Host "Starting T-Ecosystem Applications..." -ForegroundColor Green

foreach ($app in $apps) {
    if (Test-Path $app.Path) {
        Write-Host "Launching $($app.Name)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$($app.Path)'; Write-Host 'Starting $($app.Name)...'; pnpm dev"
    } else {
        Write-Host "Warning: Path not found for $($app.Name) ($($app.Path))" -ForegroundColor Yellow
    }
}

Write-Host "All launch commands issued." -ForegroundColor Green
