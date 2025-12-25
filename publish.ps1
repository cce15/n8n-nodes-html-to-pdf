# Automated Publishing Script for n8n-nodes-html-to-pdf
# Author: Abo Alhasan

Write-Host "🚀 Publishing n8n-nodes-html-to-pdf to npm" -ForegroundColor Green
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the n8n-nodes-html-to-pdf directory." -ForegroundColor Red
    exit 1
}

# Step 1: Check for email in package.json
Write-Host "📋 Step 1/6: Checking package.json..." -ForegroundColor Cyan
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ([string]::IsNullOrEmpty($packageJson.author.email)) {
    Write-Host "⚠️  Email is missing in package.json" -ForegroundColor Yellow
    $email = Read-Host "Enter your email address for npm"

    # Update package.json
    $content = Get-Content "package.json" -Raw
    $content = $content -replace '"email": ""', "`"email`": `"$email`""
    $content | Set-Content "package.json" -NoNewline

    Write-Host "✅ Updated email in package.json" -ForegroundColor Green
}

# Step 2: Clean and rebuild
Write-Host ""
Write-Host "🔨 Step 2/6: Building package..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

# Step 3: Check if logged in to npm
Write-Host ""
Write-Host "👤 Step 3/6: Checking npm login..." -ForegroundColor Cyan
npm whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in to npm" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please login to npm. If you don't have an account:"
    Write-Host "1. Go to https://www.npmjs.com/signup"
    Write-Host "2. Create a free account"
    Write-Host "3. Come back and run this script again"
    Write-Host ""

    $login = Read-Host "Do you want to login now? (y/n)"
    if ($login -eq "y") {
        npm login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Cannot publish without logging in" -ForegroundColor Red
        exit 1
    }
}

$npmUser = npm whoami
Write-Host "✅ Logged in as: $npmUser" -ForegroundColor Green

# Step 4: Check package name availability
Write-Host ""
Write-Host "🔍 Step 4/6: Checking package name availability..." -ForegroundColor Cyan
npm view n8n-nodes-html-to-pdf 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Package name 'n8n-nodes-html-to-pdf' is already taken on npm" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:"
    Write-Host "1. Use a scoped package: @$npmUser/n8n-nodes-html-to-pdf"
    Write-Host "2. Use a different name: n8n-nodes-html2pdf"
    Write-Host "3. Cancel and check if you own this package"
    Write-Host ""
    $choice = Read-Host "Enter choice (1/2/3)"

    if ($choice -eq "1") {
        $content = Get-Content "package.json" -Raw
        $content = $content -replace '"name": "n8n-nodes-html-to-pdf"', "`"name`": `"@$npmUser/n8n-nodes-html-to-pdf`""
        $content | Set-Content "package.json" -NoNewline
        Write-Host "✅ Updated package name to @$npmUser/n8n-nodes-html-to-pdf" -ForegroundColor Green
    } elseif ($choice -eq "2") {
        $newName = Read-Host "Enter new package name"
        $content = Get-Content "package.json" -Raw
        $content = $content -replace '"name": "n8n-nodes-html-to-pdf"', "`"name`": `"$newName`""
        $content | Set-Content "package.json" -NoNewline
        Write-Host "✅ Updated package name to $newName" -ForegroundColor Green
    } else {
        Write-Host "❌ Publishing cancelled" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Package name is available!" -ForegroundColor Green
}

# Step 5: Create package
Write-Host ""
Write-Host "📦 Step 5/6: Creating package..." -ForegroundColor Cyan
npm pack
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Package creation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Package created" -ForegroundColor Green

# Step 6: Publish
Write-Host ""
Write-Host "🚀 Step 6/6: Publishing to npm..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  FINAL CHECK:" -ForegroundColor Yellow
Write-Host "Package: $(Get-Content 'package.json' | ConvertFrom-Json | Select-Object -ExpandProperty name)"
Write-Host "Version: $(Get-Content 'package.json' | ConvertFrom-Json | Select-Object -ExpandProperty version)"
Write-Host "Author: $(Get-Content 'package.json' | ConvertFrom-Json | Select-Object -ExpandProperty author | Select-Object -ExpandProperty name)"
Write-Host ""

$confirm = Read-Host "Publish to npm? This cannot be undone! (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Publishing cancelled" -ForegroundColor Yellow
    exit 0
}

npm publish --access public
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Publishing failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 SUCCESS! Package published to npm!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Your package is now available at:" -ForegroundColor Cyan
$packageName = Get-Content 'package.json' | ConvertFrom-Json | Select-Object -ExpandProperty name
Write-Host "   https://www.npmjs.com/package/$packageName"
Write-Host ""
Write-Host "📥 Users can install with:" -ForegroundColor Cyan
Write-Host "   npm install $packageName"
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub release (optional)"
Write-Host "2. Share on n8n Community Forum"
Write-Host "3. Tweet about it with #n8n"
Write-Host ""
