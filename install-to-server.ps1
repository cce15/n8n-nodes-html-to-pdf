# PowerShell script for installing n8n-nodes-html-to-pdf on remote server
# Usage: .\install-to-server.ps1 user@your-server

param(
    [Parameter(Mandatory=$true)]
    [string]$Server
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Installing n8n-nodes-html-to-pdf to $Server" -ForegroundColor Green
Write-Host ""

# Step 1: Build locally
Write-Host "📦 Step 1/5: Building package locally..." -ForegroundColor Cyan
npm install
npm run build

# Step 2: Create tarball
Write-Host "📦 Step 2/5: Creating tarball..." -ForegroundColor Cyan
npm pack

$tarball = Get-ChildItem -Filter "n8n-nodes-html-to-pdf-*.tgz" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Write-Host "Created: $($tarball.Name)" -ForegroundColor Green

# Step 3: Upload to server
Write-Host "📤 Step 3/5: Uploading to server..." -ForegroundColor Cyan
scp $tarball.Name "${Server}:/tmp/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed. Make sure you have SSH access to $Server" -ForegroundColor Red
    exit 1
}

# Step 4: Install on server
Write-Host "📥 Step 4/5: Installing on server..." -ForegroundColor Cyan

$installScript = @"
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
echo 'Installing package...'
npm install /tmp/$($tarball.Name)
echo 'Installing Playwright browser...'
npx playwright install chromium
echo '✅ Installation complete!'
"@

ssh $Server $installScript

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

# Step 5: Restart n8n
Write-Host "🔄 Step 5/5: Restarting n8n..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose restart method:"
Write-Host "1) systemd (sudo systemctl restart n8n)"
Write-Host "2) PM2 (pm2 restart n8n)"
Write-Host "3) Docker (docker restart n8n-container)"
Write-Host "4) Manual (I'll restart it myself)"

$choice = Read-Host "Enter choice [1-4]"

switch ($choice) {
    "1" {
        ssh $Server "sudo systemctl restart n8n"
        Write-Host "✅ n8n restarted via systemd" -ForegroundColor Green
    }
    "2" {
        ssh $Server "pm2 restart n8n"
        Write-Host "✅ n8n restarted via PM2" -ForegroundColor Green
    }
    "3" {
        ssh $Server "docker restart n8n-container"
        Write-Host "✅ n8n container restarted" -ForegroundColor Green
    }
    "4" {
        Write-Host "⚠️  Remember to restart n8n manually!" -ForegroundColor Yellow
    }
    default {
        Write-Host "⚠️  Invalid choice. Please restart n8n manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Open n8n in your browser"
Write-Host "2. Create a new workflow"
Write-Host "3. Search for 'HTML to PDF' node"
Write-Host "4. Test the conversion"
Write-Host ""
Write-Host "Troubleshooting:"
Write-Host "- Check logs: ssh $Server 'journalctl -u n8n -f'"
Write-Host "- View guide: Get-Content REMOTE-INSTALL.md"
