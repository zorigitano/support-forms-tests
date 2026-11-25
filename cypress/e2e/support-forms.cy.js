import { getPolicyholderRoles, submitFormsForRole } from '../support/support-forms';

describe('Support Forms', () => {
  it('discovers forms for the selected policyholder type and states', () => {
    const links = [];
    cy.writeFile('cypress/fixtures/discovered-form-links.json', []);
    cy.env(['policyholderType']).then(({ policyholderType }) => {
      const roles = getPolicyholderRoles(policyholderType);
      expect(roles, `policyholder type: ${policyholderType}`).not.to.be.empty;
      roles.forEach((roleLabel) => submitFormsForRole(roleLabel, links));
    });
    cy.then(() => {
      expect(links, 'discovered form links').not.to.be.empty;
      cy.writeFile('cypress/fixtures/discovered-form-links.json', links);
    });
  });
});