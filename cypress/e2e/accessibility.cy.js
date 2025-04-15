describe('Accessibility and UX Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('All interactive elements are reachable via keyboard (Tab key)', () => {
        cy.get('body').tab(); // focus on first element
        cy.focused().should('have.attr', 'id', 'fileInput');

        cy.realPress('Tab');
        cy.focused().should('have.attr', 'id', 'loadBtn');
    });

    it('File input has accessible label', () => {
        cy.get('label[for="fileInput"]').should('exist').and('contain.text', 'Upload');
    });

    it('Chart has ARIA label or accessible name', () => {
        cy.get('#chartCanvas').should('have.attr', 'aria-label')
            .or('have.attr', 'role')
            .or('have.attr', 'aria-describedby');
    });

    it('Focus is returned to file input after error', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/bad_format.csv');
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('exist');
        cy.focused().should('have.attr', 'id', 'fileInput');
    });

    it('Error messages are screen-reader friendly (role="alert")', () => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/bad_format.csv');
        cy.get('#loadBtn').click();
        cy.get('.error-message').should('have.attr', 'role', 'alert');
    });

    it('All buttons have discernible text or aria-label', () => {
        cy.get('button').each(($btn) => {
            const hasText = $btn.text().trim().length > 0;
            const hasLabel = $btn.attr('aria-label');
            expect(hasText || hasLabel).to.be.true;
        });
    });

    it('App layout adapts on small screen (responsive)', () => {
        cy.viewport('iphone-6');
        cy.get('#fileInput').should('be.visible');
        cy.get('#loadBtn').should('be.visible');
        cy.get('#chartCanvas').should('exist');
    });
});
