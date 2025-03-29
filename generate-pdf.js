const { mdToPdf } = require('md-to-pdf');

async function generatePDF() {
    try {
        const pdf = await mdToPdf(
            { content: require('fs').readFileSync('documentation.md', 'utf-8') },
            {
                dest: 'GrocerEase_Documentation.pdf',
                css: require('fs').readFileSync('styles.css', 'utf-8'),
            }
        );
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

generatePDF(); 