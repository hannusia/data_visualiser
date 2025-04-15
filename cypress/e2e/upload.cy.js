describe('File Upload Tests', () => {
  const validCsv = 'test_data.csv';
  const invalidFile = 'invalid_file.txt';
  const emptyCsv = 'empty.csv';
  const badCsv = 'bad_format.csv';
  const specialCharCsv = 'special_chars.csv';

  beforeEach(() => {
    cy.visit('http://localhost:3000'); // adjust if different
  });

  it('Uploads a valid CSV file successfully', () => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCsv}`);
    cy.get('#loadBtn').click();
    cy.get('#tablePreview').should('exist');
    cy.get('#chartCanvas').should('exist');
  });

  it('Shows an error when uploading a non-CSV file', () => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${invalidFile}`);
    cy.get('#loadBtn').click();
    cy.contains('Please upload a valid CSV').should('be.visible');
  });

  it('Shows an error when uploading an empty CSV', () => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${emptyCsv}`);
    cy.get('#loadBtn').click();
    cy.contains('The file is empty').should('be.visible');
  });

  it('Handles a badly formatted CSV gracefully', () => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${badCsv}`);
    cy.get('#loadBtn').click();
    cy.contains('Invalid CSV format').should('be.visible');
  });

  it('Uploads CSV with special characters correctly', () => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${specialCharCsv}`);
    cy.get('#loadBtn').click();
    cy.get('#tablePreview').should('contain', 'Æ');
    cy.get('#chartCanvas').should('exist');
  });
});
