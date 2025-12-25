/**
 * Standalone test script for HTML to PDF conversion
 * Tests the core Playwright conversion logic without n8n
 */

const { chromium } = require('playwright');
const fs = require('fs/promises');
const path = require('path');

async function testConversion(htmlPath, outputPath, options = {}) {
    const {
        scale = 0.68,
        format = 'A4',
        landscape = false,
        preventCardBreaks = true,
        customCss = ''
    } = options;

    console.log(`\n📄 Testing: ${path.basename(htmlPath)}`);
    console.log(`   Output: ${path.basename(outputPath)}`);

    try {
        // Read HTML content
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');

        // Launch browser
        const browser = await chromium.launch();
        const page = await browser.newPage({
            viewport: { width: 800, height: 1200 },
        });

        // Load HTML content
        await page.setContent(htmlContent, { waitUntil: 'networkidle' });

        // Build CSS to inject
        let cssToInject = '';

        // Add threat report CSS if enabled
        if (preventCardBreaks) {
            cssToInject += `
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
            `;
        }

        // Add custom CSS
        if (customCss) {
            cssToInject += customCss;
        }

        // Inject CSS
        if (cssToInject) {
            await page.addStyleTag({ content: cssToInject });
        }

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: format,
            landscape: landscape,
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '10mm',
                right: '10mm',
            },
            scale: scale,
        });

        await browser.close();

        // Save PDF
        await fs.writeFile(outputPath, pdfBuffer);

        console.log(`   ✅ Success! Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
        return true;

    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Starting HTML to PDF Conversion Tests\n');
    console.log('═'.repeat(60));

    const testDir = __dirname;
    const outputDir = path.join(testDir, 'output');

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    const tests = [
        {
            name: 'Simple HTML Test',
            html: path.join(testDir, 'simple-test.html'),
            output: path.join(outputDir, 'simple-test.pdf'),
            options: { scale: 0.68, format: 'A4' }
        },
        {
            name: 'Threat Report Test (with card protection)',
            html: path.join(testDir, 'threat-report-test.html'),
            output: path.join(outputDir, 'threat-report-test.pdf'),
            options: { scale: 0.68, format: 'A4', preventCardBreaks: true }
        },
        {
            name: 'Threat Report Test (without card protection)',
            html: path.join(testDir, 'threat-report-test.html'),
            output: path.join(outputDir, 'threat-report-no-protection.pdf'),
            options: { scale: 0.68, format: 'A4', preventCardBreaks: false }
        },
        {
            name: 'Landscape Format Test',
            html: path.join(testDir, 'simple-test.html'),
            output: path.join(outputDir, 'simple-test-landscape.pdf'),
            options: { scale: 0.8, format: 'A4', landscape: true }
        },
        {
            name: 'Letter Format Test',
            html: path.join(testDir, 'simple-test.html'),
            output: path.join(outputDir, 'simple-test-letter.pdf'),
            options: { scale: 0.68, format: 'Letter' }
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await testConversion(test.html, test.output, test.options);
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 Test Results:`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Output: ${outputDir}`);

    if (failed === 0) {
        console.log('\n🎉 All tests passed! The node is ready for publishing.\n');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
        process.exit(1);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
