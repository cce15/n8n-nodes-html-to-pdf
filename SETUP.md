# Setup and Development Guide

This guide explains how to develop, test, and publish the n8n-nodes-html-to-pdf package.

## Prerequisites

- Node.js 18+ and npm
- n8n installed (for testing)
- Git (for version control)

## Development Setup

### 1. Install Dependencies

```bash
cd n8n-nodes-html-to-pdf
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Build the Node

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 4. Link for Local Testing

Link the package to your global npm:

```bash
npm link
```

Then in your n8n installation directory:

```bash
cd ~/.n8n/custom
npm link n8n-nodes-html-to-pdf
```

### 5. Restart n8n

```bash
n8n start
```

The HTML to PDF node should now appear in your n8n node list.

## Development Workflow

### Watch Mode

For continuous development:

```bash
npm run dev
```

This watches for TypeScript changes and recompiles automatically.

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
npm run lintfix  # Auto-fix issues
```

## Testing

### Manual Testing in n8n

1. Create a new workflow
2. Add the HTML to PDF node
3. Test with different input sources:
   - Create test HTML files
   - Use HTML content directly
   - Test with binary data from HTTP Request node

### Test Different Scenarios

- ✅ File path input with local HTML file
- ✅ HTML content input with threat report HTML
- ✅ Binary data from previous node
- ✅ Different PDF formats (A4, Letter, A3)
- ✅ Landscape and portrait orientations
- ✅ Custom margins and scale
- ✅ Threat card break prevention
- ✅ Custom CSS injection
- ✅ Batch processing (multiple items)
- ✅ Error handling (invalid HTML, missing files)

## Publishing to npm

### 1. Update Version

Edit `package.json` and increment version:

```json
{
  "version": "1.0.1"
}
```

### 2. Build and Test

```bash
npm run build
npm run lint
```

### 3. Login to npm

```bash
npm login
```

### 4. Publish

```bash
npm publish
```

### 5. Tag Release in Git

```bash
git tag v1.0.1
git push origin v1.0.1
```

## File Structure

```
n8n-nodes-html-to-pdf/
├── nodes/
│   └── HtmlToPdf/
│       └── HtmlToPdf.node.ts    # Main node implementation
├── dist/                         # Compiled output (generated)
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── gulpfile.js                   # Build scripts for icons
├── .gitignore
├── .npmignore
├── README.md                     # User documentation
└── SETUP.md                      # This file
```

## Code Architecture

### HtmlToPdf.node.ts

The main node file contains:

1. **INodeTypeDescription**: Defines node metadata, parameters, and UI
2. **execute() method**: Main execution logic
   - Launches Chromium browser
   - Processes each input item
   - Generates PDFs with Playwright
   - Returns binary data or saves to file

### Key Implementation Details

- **Browser reuse**: Single browser instance for all items in batch
- **Input flexibility**: Supports file path, HTML string, or binary data
- **Output flexibility**: Binary data, file save, or both
- **CSS injection**: Prevents page breaks in threat cards
- **Error handling**: Graceful failures with `continueOnFail()` support

## Common Issues

### "Cannot find module 'playwright'"

Run `npm install` in the package directory.

### "Browser not found"

Run `npx playwright install chromium`.

### Node doesn't appear in n8n

1. Check that `npm link` was successful
2. Restart n8n completely
3. Check n8n logs for errors
4. Verify `dist/` folder was created by build

### TypeScript errors

Make sure all dependencies are installed:

```bash
npm install
```

## Contributing

When contributing:

1. Create a feature branch
2. Make changes
3. Run `npm run lint` and `npm run build`
4. Test thoroughly in n8n
5. Submit pull request with description

## Version Guidelines

Follow semantic versioning (semver):

- **Major (1.0.0 → 2.0.0)**: Breaking changes
- **Minor (1.0.0 → 1.1.0)**: New features, backwards compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, backwards compatible
