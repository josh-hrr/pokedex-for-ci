module.exports = {
  e2e: {
    // baseUrl used by tests to visit the running app in CI
    baseUrl: 'http://localhost:8081',
    // prefer tests in cypress/e2e; keep integration as a fallback
    specPattern: [
      'cypress/e2e/**/*.js',
      'cypress/integration/**/*.js'
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // eslint-disable-next-line no-console
      console.log('using on: ', on)
      // eslint-disable-next-line no-console
      console.log('using config: ', config)
      return config
    }
  },
  video: false
}
