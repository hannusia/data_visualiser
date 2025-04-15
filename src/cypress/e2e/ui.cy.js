describe('UI Behavior Tests', () => {
    const validCsv = 'test_data.csv';
    const emptyCsv = 'empty.csv';
    const badCsv = 'bad_format.csv';

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Load button is disabled before file selection', () => {
        cy.get('#loadBtn').should('be.disabled');
    });

    it('Load button is enabled after valid file is selected', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').should('not.be.disabled');
    });

    it('Displays loading indicator when processing file', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#loadingIndicator').should('be.visible');
    });

    it('Hides loading indicator after load completes', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('#loadingIndicator').should('not.exist');
    });

    it('Displays error message on empty file', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${emptyCsv}`);
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('contain.text', 'empty');
    });

    it('Displays error message on bad format', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${badCsv}`);
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('contain.text', 'Invalid');
    });

    it('Error message disappears after new valid upload', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${badCsv}`);
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('exist');

        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('not.exist');
    });
});
