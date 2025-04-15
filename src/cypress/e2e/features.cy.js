describe('Custom Data Visualiser Feature Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('input[type="file"]').selectFile('cypress/fixtures/valid_data.csv');
        cy.get('#loadBtn').click();
    });

    it('Allows user to select specific columns for visualization', () => {
        cy.get('#columnSelector').should('exist');
        cy.get('#columnSelector').select(['Sales', 'Revenue']);
        cy.get('#chartCanvas').should('exist');
    });

    it('Chart updates when new columns are selected', () => {
        cy.get('#columnSelector').select(['Profit']);
        cy.get('#chartCanvas').then(($chart1) => {
            const firstChartHtml = $chart1.html();
            cy.get('#columnSelector').select(['Revenue']);
            cy.get('#chartCanvas').should(($chart2) => {
                expect($chart2.html()).to.not.eq(firstChartHtml);
            });
        });
    });

    it('User can export visualization as PNG', () => {
        cy.get('#exportBtn').click();
        // Optional: check download or mock request if export handled via server
        cy.readFile('cypress/downloads/chart.png').should('exist');
    });

    it('User can filter data using search bar', () => {
        cy.get('#searchInput').type('Q1');
        cy.get('#tablePreview tbody tr').each(($row) => {
            expect($row.text().toLowerCase()).to.include('q1');
        });
    });

    it('Dark mode toggles UI theme correctly', () => {
        cy.get('#themeToggleBtn').click();
        cy.get('body').should('have.class', 'dark');
        cy.get('#themeToggleBtn').click();
        cy.get('body').should('not.have.class', 'dark');
    });
});
