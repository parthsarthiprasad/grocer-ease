const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Use path.join to get the correct paths relative to the script location
const rootDir = path.join(__dirname, '..');
const markdownContent = fs.readFileSync(path.join(rootDir, 'documentation.md'), 'utf-8');
const cssContent = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf-8');

// Convert markdown to HTML using a simple regex-based approach
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Lists
        .replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Tables
        .replace(/\|.*\|/g, (match) => {
            const cells = match.split('|').filter(Boolean);
            return '<tr>' + cells.map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>';
        })
        .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
        // Paragraphs
        .replace(/^(?!<[h|u|p|t])\s*([^\n]+)\s*$/gm, '<p>$1</p>');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>${cssContent}</style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;
}

async function generatePDF() {
    try {
        const html = markdownToHtml(markdownContent);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Set content and wait for network idle
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Generate PDF
        await page.pdf({
            path: path.join(rootDir, 'GrocerEase_Documentation.pdf'),
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

generatePDF(); 