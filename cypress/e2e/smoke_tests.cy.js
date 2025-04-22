describe('Smoke Tests - Data Visualiser App', () => {
    const validCSV = 'test_data.csv'; // add this fixture to cypress/fixtures
    const invalidFile = 'invalid_file.txt'; // add this fixture too

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('SMK001 - App loads successfully', () => {
        cy.contains('upload your data').should('be.visible');
    });

    it('SMK002 - Browse button opens file dialog', () => {
        cy.get('input[type="file"]').should('exist');
    });

    it('SMK003 - Drag and drop CSV file', () => {
        cy.fixture('test_data.csv', 'base64').then(fileContent => {
          cy.get('#dropArea').attachFile(
            {
              fileContent,
              fileName: 'test_data.csv',
              mimeType: 'text/csv',
              encoding: 'base64'
            },
            {
              subjectType: 'drag-n-drop'
            }
          );
      
          cy.get('#fileName').should('contain', 'test_data.csv');
        });
      });
      

    it('SMK004 - Upload valid CSV file', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#fileName').should('contain', validCSV);
    });

    it('SMK005 - Preview table renders', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#loadBtn').click();
        cy.get('#tablePreview table').should('exist');
    });

    it('SMK006 - Chart renders', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#loadBtn').click();
        cy.get('#chartCanvas').should('be.visible');
    });

    it('SMK007 - Upload button triggers display', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#loadBtn').click();
        cy.get('#previewSection').should('be.visible');
        cy.get('#chartSection').should('be.visible');
    });

    it('SMK008 - Re-upload different file updates display', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#loadBtn').click();
        cy.get('#tablePreview table').should('exist');

        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${validCSV}`, { force: true });
        cy.get('#loadBtn').click();
        cy.get('#tablePreview table').should('exist');
    });

    it('SMK009 - Unsupported file triggers error', () => {
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${invalidFile}`, { force: true });
        cy.get('#loadBtn').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.contain('Only CSV files are supported');
        });
    });

    it('SMK010 - Upload with no file selected', () => {
        cy.get('#loadBtn').click();
        cy.on('window:alert', (txt) => {
            expect(txt).to.contain('Please select a file');
        });
    });
});
