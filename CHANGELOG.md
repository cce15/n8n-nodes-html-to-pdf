# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-24

### Added
- Initial release of HTML to PDF n8n community node
- HTML to PDF conversion using Playwright Chromium
- Support for three input sources:
  - File path from filesystem
  - HTML content as string
  - Binary data from previous nodes
- Flexible output options:
  - Return as binary data for workflow chaining
  - Save to filesystem
  - Both simultaneously
- PDF customization options:
  - Scale factor (default: 0.68)
  - Page format (A4, A3, Letter, Legal)
  - Orientation (portrait/landscape)
  - Custom margins (top, bottom, left, right)
- Threat report optimization:
  - Prevent page breaks inside `.threat-card` elements
  - Prevent page breaks inside `.ioc-box` elements
  - Container width optimization
- Custom CSS injection support for advanced styling
- Batch processing with browser instance reuse for performance
- Error handling with `continueOnFail` support
- Comprehensive documentation:
  - README with usage examples
  - Installation guides for local and remote servers
  - Quick start guide
  - Development setup guide

### Technical Details
- Built with TypeScript
- Uses Playwright 1.40.0+
- Compatible with n8n workflow automation
- MIT Licensed

---

## Future Releases

### [Unreleased]
- Ideas for future versions
- Feature requests from community
- Bug fixes and improvements

---

## Release Notes Template

When you release a new version, copy this template:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that were removed

### Fixed
- Bug fixes

### Security
- Security fixes
```
