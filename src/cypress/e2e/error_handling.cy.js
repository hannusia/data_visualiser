describe('Error Handling and Resilience Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Shows error when non-CSV file is uploaded', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/image.png');
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('contain.text', 'Unsupported file type');
    });

    it('Prevents user from submitting twice during loading', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click().should('be.disabled');
    });

    it('Handles server crash or no response gracefully', () => {
        // simulate unreachable API (if applicable)
        cy.intercept('POST', '/api/parse', { forceNetworkError: true }).as('failUpload');
        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
        cy.wait('@failUpload');
        cy.get('.error-message').should('contain.text', 'Server error');
    });

    it('Does not crash on malformed CSV with missing headers', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/no_headers.csv');
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('contain.text', 'Missing headers');
    });

    it('UI remains usable after error is shown', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/bad_format.csv');
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('exist');

        // Try again with valid file
        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('exist');
    });
});
