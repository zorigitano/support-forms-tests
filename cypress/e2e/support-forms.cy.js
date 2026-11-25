import { getPolicyholderRoles, submitFormsForRole } from '../support/support-forms';

describe('Support Forms', () => {
  it('checks forms for the selected policyholder type and states', () => {
    cy.env(['policyholderType']).then(({ policyholderType }) => {
      const roles = getPolicyholderRoles(policyholderType);
      expect(roles, `policyholder type: ${policyholderType}`).not.to.be.empty;
      roles.forEach((roleLabel) => submitFormsForRole(roleLabel));
    });
  });
});