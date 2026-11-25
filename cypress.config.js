const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      if (process.env.SUPPORT_FORMS_STATE !== undefined) {
        config.env.state = process.env.SUPPORT_FORMS_STATE;
      }
      return config;
    },
  },
});
