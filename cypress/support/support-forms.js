// © Mutual of Omaha Insurance Company. All rights reserved, however, non-human contributions are disclaimed.
// Classification: Standard
// AI Usage: AI-assisted. Tool - GitHub Copilot (version unavailable).

const supportFormsUrl = 'https://www.mutualofomaha.com/support/forms';

const policyholderTypes = {
  Beneficiary: 'a Beneficiary',
  'Individual Policyholder': 'an Individual Policyholder',
  'Plan Administrator': 'a Plan Administrator (Employer)',
  'Plan Member': 'a Plan Member (Employee)',
};

export const getPolicyholderRoles = (policyholderType) =>
  Object.entries(policyholderTypes)
    .filter(([type]) => !policyholderType || type === policyholderType)
    .map(([, roleLabel]) => roleLabel);

const getChoices = (options) =>
  Array.from(options)
    .filter((option) => option.value && option.textContent.trim() !== 'Select')
    .map((option) => ({
      value: option.value,
      label: option.textContent.trim(),
    }));

export const getStateBatch = (states, batch, batchCount) =>
  [...states]
    .sort((first, second) => first.value.localeCompare(second.value))
    .filter((state, index) => index % batchCount === batch);

export const getMatchingStates = (states, requestedState) => {
  if (!requestedState) return states;

  const requestedStates = String(requestedState).split(',').map((state) => state.trim());
  if (requestedStates.some((state) => !state)) {
    throw new Error('State names or values must not be empty');
  }

  const missingStates = requestedStates.filter((requested) =>
    !states.some((state) => state.value === requested || state.label === requested));
  if (missingStates.length) {
    throw new Error(`Unknown state names or values: ${missingStates.join(', ')}`);
  }

  return states.filter((state) =>
    requestedStates.some((requested) => state.value === requested || state.label === requested));
};

const checkFormLink = ($link) => {
  const url = $link.prop('href');

  cy.request({ url, failOnStatusCode: false })
    .its('status')
    .should('equal', 200);
};

const openAllFormSections = (requestedFormGroup) => {
  if (requestedFormGroup) {
    cy.get('button.Accordion-panelTrigger')
      .filter((_, trigger) => trigger.textContent.trim() === requestedFormGroup)
      .should('have.length', 1)
      .then(($triggers) => {
        const $trigger = $triggers.eq(0);

        if ($trigger.attr('aria-expanded') !== 'true') {
          cy.wrap($trigger).click();
        }

        cy.wrap($trigger)
          .closest('div.Accordion-panel')
          .find('div.Accordion-panelBody a.Form-link')
          .should(($links) => expect($links.length).to.be.greaterThan(0))
          .each(checkFormLink);
      });
    return;
  }

  cy.get('button.Accordion-panelTrigger')
    .should(($triggers) => expect($triggers.length).to.be.greaterThan(0))
    .each(($trigger) => {
      if ($trigger.attr('aria-expanded') !== 'true') {
        cy.wrap($trigger).click();
      }
    });

  cy.get('div.Accordion-panelBody a.Form-link')
    .should(($links) => expect($links.length).to.be.greaterThan(0))
    .each(checkFormLink);
};

export const submitFormsForRole = (roleLabel) => {
  cy.visit(supportFormsUrl);

  cy.get('select').eq(0).find('option').should(($roleOptions) => {
    expect(getChoices($roleOptions).map((choice) => choice.label), `role option: ${roleLabel}`)
      .to.include(roleLabel);
  }).then(($roleOptions) => {
    const role = getChoices($roleOptions).find((choice) => choice.label === roleLabel);

    cy.get('select').eq(0).select(role.value);

    cy.env(['state', 'formGroup', 'stateBatch', 'stateBatchCount']).then(({
      state: requestedState,
      formGroup: requestedFormGroup,
      stateBatch = 0,
      stateBatchCount = 1,
    }) => {
      const batch = Number(stateBatch);
      const batchCount = Number(stateBatchCount);
      expect(Number.isInteger(batchCount) && batchCount > 0, 'valid state batch count').to.be.true;
      expect(Number.isInteger(batch) && batch >= 0 && batch < batchCount, 'valid state batch').to.be.true;

      cy.get('select').eq(1).find('option').then(($stateOptions) => {
        const states = getChoices($stateOptions);
        const matchingStates = getMatchingStates(states, requestedState);
        expect(matchingStates, `state options for ${roleLabel}`).not.to.be.empty;
        const statesToRun = requestedState ? matchingStates : getStateBatch(matchingStates, batch, batchCount);
        cy.log(`State batch ${batch + 1} of ${batchCount}: ${statesToRun.map((state) => state.label).join(', ')}`);

        statesToRun.forEach((state) => {
          cy.get('select').eq(0).select(role.value);
          cy.get('select').eq(1).select(state.value);
          cy.contains('button', 'View Forms').click();
          cy.get('select').eq(0).should('have.value', role.value);
          cy.get('select').eq(1).should('have.value', state.value);
          openAllFormSections(requestedFormGroup);
        });
      });
    });
  });
};