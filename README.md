# Support Forms Tests

Run link discovery before checking individual links. For example:

```sh
SUPPORT_FORMS_STATE='Nebraska' npx cypress run --spec cypress/e2e/support-forms.cy.js --env 'policyholderType=Beneficiary,formGroup=Accident Forms'
SUPPORT_FORMS_CHECK_LINKS=1 npx cypress run --spec cypress/e2e/support-form-links.cy.js
```

Omit `formGroup` to check all form sections. Multiple state names or values can be separated with commas in `SUPPORT_FORMS_STATE`. The discovery fixture is generated locally and must be refreshed before each link-checking run.