const links = Cypress.expose('discoveredFormLinks');

describe('Support Forms: Links', () => {
  if (!Array.isArray(links) || links.length === 0) {
    it('requires a successful discovery run and SUPPORT_FORMS_CHECK_LINKS=1', () => {
      expect(links, 'discovered form links').to.be.an('array').and.not.to.be.empty;
    });
    return;
  }

  links.forEach(({ role, state, formGroup, label, url }) => {
    it(`${role} / ${state} / ${formGroup} / ${label} (${url})`, () => {
      cy.request({ url, failOnStatusCode: false })
        .its('status')
        .should('equal', 200);
    });
  });
});