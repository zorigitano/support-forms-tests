const { defineConfig } = require("cypress");
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      if (process.env.SUPPORT_FORMS_STATE !== undefined) {
        config.env.state = process.env.SUPPORT_FORMS_STATE;
      }
      const linksPath = join(config.projectRoot, "cypress/fixtures/discovered-form-links.json");
      if (process.env.SUPPORT_FORMS_CHECK_LINKS === "1" && existsSync(linksPath)) {
        config.expose = {
          ...config.expose,
          discoveredFormLinks: JSON.parse(readFileSync(linksPath, "utf8")),
        };
      }
      return config;
    },
  },
});
