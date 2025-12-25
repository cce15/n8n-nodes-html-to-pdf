# Before Publishing to npm - Checklist

Complete these steps before running `npm publish`

## ✅ Required Changes

### 1. Update Author Information

Edit `package.json` and change:

```json
"author": {
  "name": "Your Name",              ← Change to your name
  "email": "your.email@example.com" ← Change to your email
}
```

### 2. Create GitHub Repository (Recommended)

```bash
# On GitHub, create new repository: n8n-nodes-html-to-pdf

# Then locally:
cd n8n-nodes-html-to-pdf
git init
git add .
git commit -m "Initial commit: HTML to PDF n8n node"
git remote add origin https://github.com/YOUR-USERNAME/n8n-nodes-html-to-pdf.git
git branch -M main
git push -u origin main
```

### 3. Update Repository URLs

Edit `package.json`:

```json
"homepage": "https://github.com/YOUR-USERNAME/n8n-nodes-html-to-pdf#readme",
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR-USERNAME/n8n-nodes-html-to-pdf.git"
},
"bugs": {
  "url": "https://github.com/YOUR-USERNAME/n8n-nodes-html-to-pdf/issues"
}
```

Replace `YOUR-USERNAME` with your GitHub username.

## ✅ Optional but Recommended

### 4. Update README with Badges

Add to top of `README.md`:

```markdown
[![npm version](https://badge.fury.io/js/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 5. Create CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2024-12-24

### Added
- Initial release
- HTML to PDF conversion with Playwright
- Support for file path, HTML content, and binary input
- Threat report optimization (prevent page breaks in cards)
- Customizable PDF settings (scale, format, margins, orientation)
- Custom CSS injection
- Batch processing with browser instance reuse
```

### 6. Add More Keywords

Edit `package.json` to help users find your package:

```json
"keywords": [
  "n8n-community-node-package",
  "n8n",
  "html",
  "pdf",
  "converter",
  "playwright",
  "threat-report",
  "automation",
  "workflow",
  "html2pdf",
  "report-generator"
]
```

## ✅ Pre-Publish Testing

### 7. Test Build

```bash
npm install
npm run build
```

Check that `dist/` folder was created and contains:
```
dist/
├── nodes/
│   └── HtmlToPdf/
│       ├── HtmlToPdf.node.js
│       ├── HtmlToPdf.node.d.ts
│       └── htmltopdf.svg
```

### 8. Test Package Contents

```bash
npm pack
tar -tzf n8n-nodes-html-to-pdf-1.0.0.tgz
```

Verify it includes only `dist/` folder and essential files (README, LICENSE, package.json).

### 9. Test Local Installation

```bash
npm install -g ./n8n-nodes-html-to-pdf-1.0.0.tgz
```

Then test in n8n locally.

## ✅ npm Account Setup

### 10. Create npm Account

If you don't have one:
1. Go to https://www.npmjs.com/signup
2. Create account
3. Verify email

### 11. Login

```bash
npm login
```

### 12. Check Package Name Availability

```bash
npm search n8n-nodes-html-to-pdf
```

If taken, consider:
- `n8n-nodes-html2pdf`
- `@yourname/n8n-nodes-html-to-pdf`

## 🚀 Ready to Publish!

Once all checkboxes are complete:

```bash
npm publish
```

## After Publishing

### Create Git Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Share Your Package

- ✅ Tweet with #n8n
- ✅ Post on n8n Community: https://community.n8n.io/
- ✅ Share on LinkedIn/Twitter

### Monitor

- Check npm page: https://www.npmjs.com/package/n8n-nodes-html-to-pdf
- Watch GitHub for issues
- Respond to community feedback

---

## Quick Checklist

- [ ] Updated author name and email in package.json
- [ ] Created GitHub repository
- [ ] Updated repository URLs in package.json
- [ ] Added badges to README (optional)
- [ ] Created CHANGELOG.md (optional)
- [ ] Tested build (`npm run build`)
- [ ] Tested package contents (`npm pack`)
- [ ] Created npm account
- [ ] Logged in to npm (`npm login`)
- [ ] Checked package name availability

**Ready?** → Run `npm publish`
