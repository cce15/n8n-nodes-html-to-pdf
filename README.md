# n8n-nodes-html-to-pdf

[![npm version](https://badge.fury.io/js/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-html-to-pdf.svg)](https://www.npmjs.com/package/n8n-nodes-html-to-pdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an n8n community node that converts HTML to PDF using Playwright. It's optimized for threat reports but works with any HTML content.

## Features

- 🎯 **Multiple Input Sources**: File path, HTML string, or binary data from previous nodes
- 📄 **Flexible Output**: Return as binary data, save to file, or both
- 🎨 **Threat Report Optimization**: Prevents page breaks inside threat cards and IOC boxes
- ⚙️ **Customizable PDF Settings**: Scale, format (A4, Letter, etc.), orientation, margins
- 💉 **Custom CSS Injection**: Add your own styling to control PDF generation
- 🚀 **Batch Processing**: Efficiently processes multiple HTML files by reusing browser instance

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Click **Install**
3. Enter `n8n-nodes-html-to-pdf`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-html-to-pdf
```

### Post-Installation

After installing the node, you need to install Playwright browsers:

```bash
npx playwright install chromium
```

## Usage

### Basic Workflow

1. Add the **HTML to PDF** node to your workflow
2. Configure the input source:
   - **File Path**: Provide path to HTML file on filesystem
   - **HTML Content**: Paste HTML as text
   - **Binary Data**: Use HTML from previous node's binary output
3. Configure output options:
   - **Return Binary Data**: Pass PDF to next node (e.g., email, cloud storage)
   - **Save to File**: Write PDF to filesystem
   - **Both**: Do both
4. Adjust PDF settings as needed (scale, format, margins)

### Example Workflows

#### Convert HTML File and Email

```
Read Files → HTML to PDF → Send Email
```

#### Generate Report from API and Save

```
HTTP Request → HTML to PDF → Write Binary File
```

#### Batch Convert Multiple Files

```
Read Files (multiple) → HTML to PDF → Save to Cloud Storage
```

## Node Parameters

### Input Source

| Option | Description |
|--------|-------------|
| File Path | Read HTML from filesystem path |
| HTML Content | Use HTML string directly |
| Binary Data | Use binary data from previous node |

### Output Options

| Option | Description |
|--------|-------------|
| Return Binary Data | Pass PDF as binary to next node |
| Save to File | Write PDF to filesystem |
| Both | Do both operations |

### PDF Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| Scale | 0.68 | Rendering scale factor (0.1-2) |
| Format | A4 | Page format (A4, A3, Letter, Legal) |
| Landscape | false | Use landscape orientation |
| Margins | 10mm | Page margins (top, bottom, left, right) |

### Threat Report Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| Prevent Card Breaks | true | Prevent page breaks in .threat-card and .ioc-box elements |
| Custom CSS | - | Additional CSS to inject into page |

## Technical Details

### How It Works

1. **Browser Instance Management**: Launches a single Chromium browser instance for all items in a batch
2. **CSS Injection**: Injects CSS to prevent page breaks and apply custom styling
3. **PDF Generation**: Uses Playwright's PDF generation with configurable settings
4. **Binary Handling**: Returns PDF as base64-encoded binary data compatible with n8n's binary data format

### CSS Injection for Threat Reports

When "Prevent Card Breaks" is enabled, the following CSS is injected:

```css
.threat-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.ioc-box {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
.container {
    max-width: 100% !important;
}
```

This ensures threat cards and IOC (Indicator of Compromise) boxes are never split across pages.

### Performance

- Reuses browser instance across batch items for efficiency
- Supports concurrent workflow execution
- Memory-efficient binary data handling

## Troubleshooting

### "Playwright not installed" Error

Run this command where n8n is installed:

```bash
npx playwright install chromium
```

### "File not found" Error

Ensure the file path is absolute and accessible by the n8n process. Use the **Read/Write Files from Disk** node for better path handling.

### PDF looks incorrect

- Adjust the **Scale** parameter (try 0.5 to 1.0)
- Check if your HTML requires specific viewport size
- Use **Custom CSS** to fix layout issues

### Memory issues with large files

- Process files individually rather than in large batches
- Reduce HTML complexity
- Consider using smaller images

## License

MIT

## Contributing

Contributions are welcome! Please open issues or pull requests on the repository.

## Version History

### 1.0.0 (Initial Release)
- HTML to PDF conversion with Playwright
- Multiple input sources (file, content, binary)
- Flexible output options
- Threat report optimization
- Custom CSS injection
- Batch processing support
