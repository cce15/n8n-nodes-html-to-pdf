# Publishing to npm Guide

Yes! You can publish this package to npm, making it easy for anyone to install with a simple command.

## Benefits of Publishing to npm

✅ **Easy Installation**: Users can install with `npm install n8n-nodes-html-to-pdf`
✅ **Automatic Updates**: Users can update with `npm update`
✅ **Community Discovery**: Listed on npmjs.com for others to find
✅ **Version Management**: npm handles versioning automatically
✅ **Professional**: Shows up in n8n Community Nodes

## Before Publishing - Checklist

### 1. Update package.json

Edit `package.json` and update these fields:

```json
{
  "name": "n8n-nodes-html-to-pdf",
  "version": "1.0.0",
  "description": "n8n node for converting HTML to PDF using Playwright (optimized for threat reports)",
  "author": {
    "name": "Your Name",           ← CHANGE THIS
    "email": "your.email@example.com"  ← CHANGE THIS
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/n8n-nodes-html-to-pdf.git"  ← CHANGE THIS
  },
  "homepage": "https://github.com/yourusername/n8n-nodes-html-to-pdf#readme",  ← ADD THIS
  "bugs": {
    "url": "https://github.com/yourusername/n8n-nodes-html-to-pdf/issues"  ← ADD THIS
  },
  "license": "MIT"
}
```

### 2. Choose a License

The package currently uses MIT license (most common for npm packages).

Create `LICENSE` file:

```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[... rest of MIT license text]
```

### 3. Create GitHub Repository (Recommended)

```bash
cd n8n-nodes-html-to-pdf

git init
git add .
git commit -m "Initial commit: HTML to PDF n8n node"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/n8n-nodes-html-to-pdf.git
git branch -M main
git push -u origin main
```

### 4. Test Locally First

```bash
# Install dependencies
npm install

# Build
npm run build

# Test the build worked
ls dist/

# Run linter (if configured)
npm run lint
```

## Publishing Steps

### Step 1: Create npm Account

If you don't have an npm account:

1. Go to https://www.npmjs.com/signup
2. Create account (free)
3. Verify email

### Step 2: Login to npm

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

### Step 3: Check Package Name Availability

```bash
npm search n8n-nodes-html-to-pdf
```

If name is taken, you can:
- Use a different name: `n8n-nodes-html2pdf`, `@yourname/n8n-nodes-html-to-pdf`
- Contact the owner if package is abandoned

### Step 4: Publish

```bash
# Do final build
npm run build

# Publish to npm
npm publish
```

**That's it!** Your package is now on npm at:
`https://www.npmjs.com/package/n8n-nodes-html-to-pdf`

### Step 5: Verify

```bash
# Search for your package
npm search n8n-nodes-html-to-pdf

# View package page
npm view n8n-nodes-html-to-pdf
```

## After Publishing

### Users Can Now Install Simply:

```bash
cd ~/.n8n/custom
npm install n8n-nodes-html-to-pdf
npx playwright install chromium
# Restart n8n
```

### Tag the Release on GitHub

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Share Your Package

- Tweet about it with #n8n hashtag
- Share on n8n Community Forum: https://community.n8n.io/
- Add to n8n Community Nodes list

## Updating Your Package

When you make changes:

### 1. Update Version

Edit `package.json`:

```json
{
  "version": "1.0.1"  // Increment version
}
```

**Version Guidelines (Semantic Versioning):**
- `1.0.0 → 1.0.1` - Bug fixes (patch)
- `1.0.0 → 1.1.0` - New features (minor)
- `1.0.0 → 2.0.0` - Breaking changes (major)

### 2. Commit Changes

```bash
git add .
git commit -m "Fix: Description of changes"
git push
```

### 3. Publish Update

```bash
npm run build
npm publish
git tag v1.0.1
git push origin v1.0.1
```

### 4. Users Update

```bash
npm update n8n-nodes-html-to-pdf
```

## Publishing as Scoped Package (Alternative)

If the name is taken, publish under your username:

### Update package.json:

```json
{
  "name": "@yourusername/n8n-nodes-html-to-pdf",
}
```

### Publish:

```bash
npm publish --access public
```

Users install with:

```bash
npm install @yourusername/n8n-nodes-html-to-pdf
```

## Private Publishing (If You Don't Want Public)

### Option 1: Private npm Package (Paid)

```bash
npm publish --access restricted
```

Requires npm Pro ($7/month)

### Option 2: GitHub Packages (Free for public repos)

Configure `.npmrc`:

```
@yourusername:registry=https://npm.pkg.github.com
```

Publish:

```bash
npm publish
```

### Option 3: Private npm Registry

Use Verdaccio, Nexus, or Artifactory

## Best Practices

### 1. Add .npmignore

Already included, but verify it excludes:

```
nodes/
*.ts
!dist/**/*.d.ts
```

### 2. Add Keywords for Discovery

In `package.json`:

```json
{
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "html",
    "pdf",
    "converter",
    "playwright",
    "threat-report",
    "automation",
    "workflow"
  ]
}
```

### 3. Add Badges to README

```markdown
[![npm version](https://badge.fury.io/js/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 4. Create CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2024-12-24
### Added
- Initial release
- HTML to PDF conversion with Playwright
- Support for file path, HTML content, and binary input
- Threat report optimization with card break prevention
- Customizable PDF settings
- Batch processing support
```

### 5. Test Before Publishing

```bash
# Test package contents
npm pack
tar -tzf n8n-nodes-html-to-pdf-1.0.0.tgz

# Test installation locally
npm install ./n8n-nodes-html-to-pdf-1.0.0.tgz
```

## Unpublishing (If Needed)

⚠️ **Warning**: Only unpublish within 72 hours of publishing

```bash
npm unpublish n8n-nodes-html-to-pdf@1.0.0
```

After 72 hours, you can only deprecate:

```bash
npm deprecate n8n-nodes-html-to-pdf@1.0.0 "This version is deprecated"
```

## Submit to n8n Community Nodes

After publishing to npm:

1. Go to https://github.com/n8n-io/n8n
2. Find "Community Nodes" documentation
3. Submit your package for inclusion in the official list

## Monitoring Your Package

### npm Stats

```bash
npm view n8n-nodes-html-to-pdf
```

### Download Stats

Check at: `https://npm-stat.com/charts.html?package=n8n-nodes-html-to-pdf`

### User Feedback

Monitor:
- npm package issues
- GitHub issues
- n8n Community Forum

## Summary Commands

```bash
# 1. Prepare
npm install
npm run build

# 2. Login
npm login

# 3. Publish
npm publish

# 4. Tag release
git tag v1.0.0
git push origin v1.0.0
```

---

## Quick Decision Guide

**Should you publish to npm?**

✅ **Yes, if:**
- You want easy installation for users
- You want community to use it
- You want to contribute to n8n ecosystem
- You're okay with public code (MIT license)

❌ **No, if:**
- The code is proprietary/private
- You only need it on your own servers
- You don't want to maintain it

**Recommendation:** ✅ Publish it! It's a useful tool and the n8n community will appreciate it.
