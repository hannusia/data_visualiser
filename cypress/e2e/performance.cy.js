describe('Performance and Edge Network Condition Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Successfully processes a 5MB+ CSV file without crashing', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/huge_file.csv');
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('exist');
    });

    it('Shows loading indicator during slow upload', () => {
        cy.intercept('POST', '/api/parse', (req) => {
            req.on('response', (res) => {
                res.setDelay(3000); // simulate 3s delay
            });
        }).as('slowUpload');

        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
        cy.get('#loadingIndicator').should('be.visible');
        cy.wait('@slowUpload');
        cy.get('#loadingIndicator').should('not.exist');
    });

    it('Handles timeout from server gracefully', () => {
        cy.intercept('POST', '/api/parse', {
            delay: 6000,
            statusCode: 504,
            body: 'Gateway Timeout'
        }).as('timeout');

        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
        cy.wait('@timeout');
        cy.get('.error-message').should('contain.text', 'timeout');
    });

    it('UI stays responsive during long processing', () => {
        cy.intercept('POST', '/api/parse', (req) => {
            req.on('response', (res) => res.setDelay(4000));
        }).as('longProcess');

        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
        cy.get('body').click(); // Try interacting during load
        cy.wait('@longProcess');
        cy.get('#chartCanvas').should('exist');
    });

    it('Processes batch of multiple files sequentially (if supported)', () => {
        // Optional: only if app supports batch uploads
        cy.get('input[type="file"]').selectFile([
            'cypress/fixtures/valid_data.csv',
            'cypress/fixtures/missing_data.csv',
        ]);
        cy.get('#loadBtn').click();
        cy.get('#tablePreview').should('exist');
    });
});
