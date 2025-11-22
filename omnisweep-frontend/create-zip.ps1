# PowerShell script to create a shareable frontend zip
Write-Host "Creating frontend zip file..." -ForegroundColor Green

# Output zip file name
$zipName = "omnisweep-frontend.zip"
$outputPath = Join-Path $PSScriptRoot "..\$zipName"

# Remove old zip if exists
if (Test-Path $outputPath) {
    Remove-Item $outputPath
    Write-Host "Removed old zip file" -ForegroundColor Yellow
}

# Create temporary directory
$tempDir = Join-Path $PSScriptRoot "temp_zip"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy all files except excluded ones
Write-Host "Copying files..." -ForegroundColor Cyan
$exclude = @('node_modules', '.next', 'temp_zip', 'create-zip.ps1', '.env.local', 'omnisweep-frontend.zip')

Get-ChildItem -Path $PSScriptRoot | Where-Object { 
    $exclude -notcontains $_.Name 
} | Copy-Item -Destination $tempDir -Recurse -Force

# Create zip
Write-Host "Creating zip archive..." -ForegroundColor Cyan
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -Force

# Cleanup
Remove-Item -Recurse -Force $tempDir

Write-Host "Zip file created successfully: $outputPath" -ForegroundColor Green
$sizeMB = [math]::Round((Get-Item $outputPath).Length / 1MB, 2)
Write-Host "Size: $sizeMB MB" -ForegroundColor Cyan
