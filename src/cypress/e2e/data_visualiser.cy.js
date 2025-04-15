describe('Data Visualiser App', () => {
  it('loads the home page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Data Visualiser');
  });

  it('uploads a CSV file and renders chart', () => {
    cy.visit('http://localhost:3000');

    const csvFile = 'test_data.csv';

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${csvFile}`);
    cy.get('#loadBtn').click();

    cy.get('#tablePreview').should('exist');
    cy.get('#chartCanvas').should('exist');
  });
});
