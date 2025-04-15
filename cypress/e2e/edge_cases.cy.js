describe('Edge Case Upload Tests', () => {
    const largeCsv = 'large_data.csv';
    const missingDataCsv = 'missing_data.csv';
    const singleColumnCsv = 'single_column.csv';
    const blankLinesCsv = 'blank_lines.csv';
    const duplicateRowsCsv = 'duplicate_rows.csv';

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Handles large CSV file (1000+ rows)', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${largeCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview tbody tr').should('have.length.at.least', 1000);
        cy.get('#chartCanvas').should('exist');
    });

    it('Displays table with missing values', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${missingDataCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview tbody td').should('contain', '');
    });

    it('Handles single-column CSV gracefully', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${singleColumnCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview thead th').should('have.length', 1);
    });

    it('Skips or warns about blank lines in CSV', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${blankLinesCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview tbody tr').should('have.length', 3); // only 3 actual rows
    });

    it('Handles duplicate rows without crashing', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${duplicateRowsCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview tbody tr').should('have.length', 6); // 3 rows, duplicated
    });
});
