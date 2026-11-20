// © Mutual of Omaha Insurance Company. All rights reserved, however, non-human contributions are disclaimed.
// Classification: Standard
// AI Usage: AI-assisted. Tool - GitHub Copilot (version unavailable).

const supportFormsUrl = 'https://www.mutualofomaha.com/support/forms';

const getChoices = (options) =>
  Array.from(options)
    .filter((option) => option.value && option.textContent.trim() !== 'Select')
    .map((option) => ({
      value: option.value,
      label: option.textContent.trim(),
    }));

const openAllFormSections = () => {
  cy.get('button.Accordion-panelTrigger')
    .should(($triggers) => expect($triggers.length).to.be.greaterThan(0))
    .each(($trigger) => {
      if ($trigger.attr('aria-expanded') !== 'true') {
        cy.wrap($trigger).click();
      }
    });

  cy.get('div.Accordion-panelBody a.Form-link')
    .should(($links) => expect($links.length).to.be.greaterThan(0))
    .each(($link) => {
      const url = $link.prop('href');

      cy.request({ url, failOnStatusCode: false })
        .its('status')
        .should('equal', 200);
    });
};

export const submitFormsForRole = (roleLabel) => {
  cy.visit(supportFormsUrl);

  cy.get('select').eq(0).find('option').then(($roleOptions) => {
    const role = getChoices($roleOptions).find((choice) => choice.label === roleLabel);
    expect(role, `role option: ${roleLabel}`).to.exist;

    cy.get('select').eq(0).select(role.value);

    cy.get('select').eq(1).find('option').then(($stateOptions) => {
      const states = getChoices($stateOptions);
      expect(states, `state options for ${roleLabel}`).not.to.be.empty;

      states.forEach((state) => {
        cy.get('select').eq(0).select(role.value);
        cy.get('select').eq(1).select(state.value);
        cy.contains('button', 'View Forms').click();
        cy.get('select').eq(0).should('have.value', role.value);
        cy.get('select').eq(1).should('have.value', state.value);
        openAllFormSections();
      });
    });
  });
};