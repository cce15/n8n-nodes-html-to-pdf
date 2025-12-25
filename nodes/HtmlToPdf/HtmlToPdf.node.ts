import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

export class HtmlToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML to PDF',
		name: 'htmlToPdf',
		icon: 'file:htmltopdf.svg',
		group: ['transform'],
		version: 1,
		description: 'Convert HTML to PDF with Playwright (optimized for threat reports)',
		defaults: {
			name: 'HTML to PDF',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Input Source',
				name: 'inputSource',
				type: 'options',
				options: [
					{
						name: 'File Path',
						value: 'filePath',
					},
					{
						name: 'HTML Content',
						value: 'htmlContent',
					},
					{
						name: 'Binary Data',
						value: 'binaryData',
					},
				],
				default: 'filePath',
				description: 'Source of the HTML to convert',
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['filePath'],
					},
				},
				description: 'Path to the HTML file on the filesystem',
			},
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['htmlContent'],
					},
				},
				description: 'HTML content as string',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryProperty',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						inputSource: ['binaryData'],
					},
				},
				description: 'Name of the binary property containing the HTML file',
			},
			{
				displayName: 'Output Options',
				name: 'outputOptions',
				type: 'options',
				options: [
					{
						name: 'Return Binary Data',
						value: 'binary',
					},
					{
						name: 'Save to File',
						value: 'file',
					},
					{
						name: 'Both',
						value: 'both',
					},
				],
				default: 'binary',
				description: 'How to output the generated PDF',
			},
			{
				displayName: 'Output File Path',
				name: 'outputPath',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						outputOptions: ['file', 'both'],
					},
				},
				description: 'Path where to save the PDF file (leave empty for auto-generated name)',
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Scale',
						name: 'scale',
						type: 'number',
						typeOptions: {
							minValue: 0.1,
							maxValue: 2,
						},
						default: 0.68,
						description: 'Scale factor for rendering (0.1 to 2)',
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{ name: 'A4', value: 'A4' },
							{ name: 'A3', value: 'A3' },
							{ name: 'Letter', value: 'Letter' },
							{ name: 'Legal', value: 'Legal' },
						],
						default: 'A4',
						description: 'Page format',
					},
					{
						displayName: 'Landscape',
						name: 'landscape',
						type: 'boolean',
						default: false,
						description: 'Whether to use landscape orientation',
					},
					{
						displayName: 'Margin Top',
						name: 'marginTop',
						type: 'string',
						default: '10mm',
						description: 'Top margin (e.g., 10mm, 1in)',
					},
					{
						displayName: 'Margin Bottom',
						name: 'marginBottom',
						type: 'string',
						default: '10mm',
						description: 'Bottom margin',
					},
					{
						displayName: 'Margin Left',
						name: 'marginLeft',
						type: 'string',
						default: '10mm',
						description: 'Left margin',
					},
					{
						displayName: 'Margin Right',
						name: 'marginRight',
						type: 'string',
						default: '10mm',
						description: 'Right margin',
					},
				],
			},
			{
				displayName: 'Threat Report Options',
				name: 'threatReportOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Prevent Card Breaks',
						name: 'preventCardBreaks',
						type: 'boolean',
						default: true,
						description: 'Whether to prevent page breaks inside threat cards and IOC boxes',
					},
					{
						displayName: 'Custom CSS',
						name: 'customCss',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'Additional CSS to inject into the page',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		let browser: Browser | null = null;

		try {
			// Launch browser once for all items
			browser = await chromium.launch();

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					const inputSource = this.getNodeParameter('inputSource', itemIndex) as string;
					const outputOptions = this.getNodeParameter('outputOptions', itemIndex) as string;
					const pdfOptions = this.getNodeParameter('pdfOptions', itemIndex, {}) as any;
					const threatReportOptions = this.getNodeParameter('threatReportOptions', itemIndex, {}) as any;

					let htmlContent = '';
					let sourceFilename = 'output.pdf';

					// Get HTML content based on input source
					if (inputSource === 'filePath') {
						const filePath = this.getNodeParameter('filePath', itemIndex) as string;
						htmlContent = await fs.readFile(filePath, 'utf-8');
						sourceFilename = path.basename(filePath, path.extname(filePath)) + '.pdf';
					} else if (inputSource === 'htmlContent') {
						htmlContent = this.getNodeParameter('htmlContent', itemIndex) as string;
					} else if (inputSource === 'binaryData') {
						const binaryPropertyName = this.getNodeParameter('binaryProperty', itemIndex) as string;
						const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
						htmlContent = Buffer.from(binaryData.data, 'base64').toString('utf-8');
						sourceFilename = binaryData.fileName || 'output.pdf';
						if (!sourceFilename.endsWith('.pdf')) {
							sourceFilename = sourceFilename.replace(/\.[^.]+$/, '.pdf');
						}
					}

					// Create new page
					const page = await browser.newPage({
						viewport: { width: 800, height: 1200 },
					});

					// Load HTML content
					await page.setContent(htmlContent, { waitUntil: 'networkidle' });

					// Build CSS to inject
					let cssToInject = '';

					// Add threat report CSS if enabled
					if (threatReportOptions.preventCardBreaks !== false) {
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
					if (threatReportOptions.customCss) {
						cssToInject += threatReportOptions.customCss;
					}

					// Inject CSS
					if (cssToInject) {
						await page.addStyleTag({ content: cssToInject });
					}

					// Generate PDF
					const pdfBuffer = await page.pdf({
						format: pdfOptions.format || 'A4',
						landscape: pdfOptions.landscape || false,
						printBackground: true,
						margin: {
							top: pdfOptions.marginTop || '10mm',
							bottom: pdfOptions.marginBottom || '10mm',
							left: pdfOptions.marginLeft || '10mm',
							right: pdfOptions.marginRight || '10mm',
						},
						scale: pdfOptions.scale || 0.68,
					});

					await page.close();

					// Handle output
					const newItem: INodeExecutionData = {
						json: {
							success: true,
							filename: sourceFilename,
							size: pdfBuffer.length,
						},
						binary: {},
					};

					// Save to file if requested
					if (outputOptions === 'file' || outputOptions === 'both') {
						let outputPath = this.getNodeParameter('outputPath', itemIndex, '') as string;
						if (!outputPath) {
							outputPath = sourceFilename;
						}
						await fs.writeFile(outputPath, pdfBuffer);
						newItem.json.outputPath = outputPath;
					}

					// Return binary data if requested
					if (outputOptions === 'binary' || outputOptions === 'both') {
						newItem.binary!.data = await this.helpers.prepareBinaryData(
							pdfBuffer,
							sourceFilename,
							'application/pdf',
						);
					}

					returnData.push(newItem);

				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : String(error),
								success: false,
							},
						});
						continue;
					}
					throw error;
				}
			}

		} finally {
			// Close browser
			if (browser) {
				await browser.close();
			}
		}

		return [returnData];
	}
}
