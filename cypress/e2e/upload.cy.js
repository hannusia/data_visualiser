describe('File Upload Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Uploads a valid CSV using browse', () => {
    cy.get('#fileInput').attachFile('test_data.csv');
    cy.get('#fileName').should('contain', 'test_data.csv');
    cy.get('#loadBtn').click();
    cy.get('#previewSection').should('be.visible');
    cy.get('#chartSection').should('be.visible');
  });

  it('Uploads a valid CSV via drag and drop', () => {
    cy.get('#dropArea').attachFile('test_data.csv', { subjectType: 'drag-n-drop' });
    cy.get('#fileName').should('contain', 'test_data.csv');
    cy.get('#loadBtn').click();
    cy.get('#previewSection').should('be.visible');
    cy.get('#chartSection').should('be.visible');
  });

  it('Shows error on invalid file type (.txt)', () => {
    cy.get('#fileInput').attachFile('invalid_file.txt');
    cy.get('#fileName').should('contain', 'invalid_file.txt');
    cy.get('#loadBtn').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Only CSV files are supported');
    });
  });

  it('Shows error if no file is selected', () => {
    cy.get('#loadBtn').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Please select a file!');
    });
  });

  it('Displays filename after browse', () => {
    cy.get('#fileInput').attachFile('test_data.csv');
    cy.get('#fileName').should('contain', 'test_data.csv');
  });

  it('Displays filename after drag and drop', () => {
    cy.get('#dropArea').attachFile('test_data.csv', { subjectType: 'drag-n-drop' });
    cy.get('#fileName').should('contain', 'test_data.csv');
  });

  // it('7. Uploads empty CSV and shows no preview', () => {
  //   cy.get('#fileInput').attachFile('empty.csv');
  //   cy.get('#loadBtn').click();
  //   cy.get('#previewSection').should('not.be.visible');
  //   cy.get('#chartSection').should('not.be.visible');
  // });

  it('Uploads large CSV file', () => {
    cy.get('#fileInput').attachFile('test_data.csv'); // Replace with a large one later
    cy.get('#loadBtn').click();
    cy.get('#previewSection').should('be.visible');
  });

  it('Uploads CSV with non-numeric Y values', () => {
    cy.get('#fileInput').attachFile('test_data.csv'); // Ensure the second column is not all numeric
    cy.get('#loadBtn').click();
    cy.get('#chartSection').should('be.visible');
  });

  // it('Prevents chart from rendering if only 1 column', () => {
  //   cy.get('#fileInput').attachFile('single_column.csv'); // Add to fixtures
  //   cy.get('#loadBtn').click();
  //   cy.get('#chartSection').should('not.be.visible');
  // });

  it('Prevents uploading an unsupported file format', () => {
    cy.get('input[type="file"]').attachFile('image.png');
    cy.get('#loadBtn').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Only CSV files are supported');
    });
  });

  it('Uploads a large CSV file and shows only preview subset', () => {
    cy.get('input[type="file"]').attachFile('large_data.csv');
    cy.get('#loadBtn').click();
    cy.get('#tablePreview tr').should('have.length.lte', 11); // 1 header + 10 rows
  });

  it('Displays uploaded file name correctly', () => {
    cy.get('input[type="file"]').attachFile('test_data.csv');
    cy.get('#fileName').should('contain', 'test_data.csv');
  });

  

});
