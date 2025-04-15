describe('Table Rendering Tests', () => {
    const validCsv = 'test_data.csv';
    const longCsv = 'long_data.csv';
    const numericCsv = 'numeric_data.csv';
  
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('Displays table after valid CSV upload', () => {
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
      cy.get('#loadBtn').click();
      cy.get('#tablePreview').should('be.visible');
    });
  
    it('Shows correct number of rows (excluding header)', () => {
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
      cy.get('#loadBtn').click();
      cy.get('#tablePreview tbody tr').should('have.length', 3); // A, B, C
    });
  
    it('Displays correct table headers', () => {
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
      cy.get('#loadBtn').click();
      cy.get('#tablePreview thead th').eq(0).should('contain', 'Label');
      cy.get('#tablePreview thead th').eq(1).should('contain', 'Value');
    });
  
    it('Displays long CSV correctly (only first 10 rows)', () => {
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${longCsv}`);
      cy.get('#loadBtn').click();
      cy.get('#tablePreview tbody tr').should('have.length', 10);
    });
  
    it('Displays numeric data correctly in table cells', () => {
      cy.get('input[type="file"]').selectFile(`cypress/fixtures/${numericCsv}`);
      cy.get('#loadBtn').click();
      cy.get('#tablePreview tbody td').eq(1).should('contain', '123');
    });
  });
  