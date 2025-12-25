# Quick Start Guide

Get the HTML to PDF n8n node up and running in minutes.

## Installation

### Step 1: Navigate to package directory

```bash
cd n8n-nodes-html-to-pdf
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install Playwright browser

```bash
npx playwright install chromium
```

### Step 4: Build the package

```bash
npm run build
```

### Step 5: Link to n8n

```bash
npm link
cd ~/.n8n/custom  # or your n8n directory
npm link n8n-nodes-html-to-pdf
```

### Step 6: Restart n8n

```bash
n8n start
```

## First Workflow

### Example 1: Convert Local HTML File

1. Add **HTML to PDF** node
2. Set **Input Source**: File Path
3. Set **File Path**: `/path/to/your/file.html`
4. Set **Output Options**: Return Binary Data
5. Add **Write Binary File** node
6. Connect nodes and execute

### Example 2: Convert HTML from Previous Node

1. Add **HTTP Request** node
   - URL: `https://example.com`
   - Response Format: String
2. Add **HTML to PDF** node
   - Input Source: HTML Content
   - HTML Content: `{{$json.data}}`
3. Add **Send Email** node
   - Attach binary data
4. Execute workflow

### Example 3: Threat Report with Card Protection

1. Add **HTML to PDF** node
2. Configure:
   - Input Source: File Path
   - File Path: `/path/to/threat_report.html`
   - PDF Options > Scale: `0.68`
   - PDF Options > Format: `A4`
   - Threat Report Options > Prevent Card Breaks: `true`
3. The output PDF will prevent `.threat-card` and `.ioc-box` elements from breaking across pages

## Testing Your Node

### Test with the Original Python Converter HTML

If you have HTML files that work with the original Python converter, they'll work the same way with this n8n node. The CSS injection and PDF settings are identical.

```bash
# Original Python command
python html_to_pdf_converter.py threat_report.html

# Equivalent in n8n
Input Source: File Path
File Path: threat_report.html
Output Options: Save to File
```

## Common Parameters

| Parameter | Recommended Value | Use Case |
|-----------|------------------|----------|
| Scale | 0.68 | Threat reports (matches Python version) |
| Scale | 0.8 | General documents |
| Scale | 1.0 | Web page screenshots |
| Format | A4 | International standard |
| Format | Letter | US standard |
| Prevent Card Breaks | true | Threat/security reports |
| Prevent Card Breaks | false | General HTML documents |

## Next Steps

- Read [README.md](README.md) for full documentation
- Read [SETUP.md](SETUP.md) for development guide
- Check [HtmlToPdf.node.ts](nodes/HtmlToPdf/HtmlToPdf.node.ts) for implementation details

## Troubleshooting

**Node doesn't appear in n8n**
- Make sure you ran `npm run build`
- Check that `npm link` completed successfully
- Restart n8n completely

**"Playwright not installed" error**
```bash
npx playwright install chromium
```

**PDF looks wrong**
- Try adjusting the Scale parameter
- Check if your HTML has responsive CSS
- Use Custom CSS to override styles

## Support

For issues, questions, or contributions, please check the main README.md file.
