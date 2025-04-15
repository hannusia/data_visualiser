describe('Chart Rendering Tests', () => {
    const validCsv = 'valid_data.csv';
    const updateCsv = 'update_chart.csv';
    const emptyCsv = 'empty.csv';
    const badCsv = 'bad_format.csv';

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Renders chart after valid CSV upload', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('exist').and('be.visible');
    });

    it('X-axis labels match CSV labels', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('contain.text', 'A')
            .and('contain.text', 'B')
            .and('contain.text', 'C');
    });

    it('Y-axis values reflect data values', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('contain.text', '10')
            .and('contain.text', '20')
            .and('contain.text', '30');
    });

    it('Chart updates when new CSV is uploaded', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('contain.text', 'A');

        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${updateCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('contain.text', 'X')
            .and('not.contain.text', 'A');
    });

    it('Does not render chart on empty CSV', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${emptyCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('not.exist');
    });

    it('Does not render chart on badly formatted CSV', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${badCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('not.exist');
    });
});
