module.exports = {
  e2e: {
    // baseUrl used by tests to visit the running app in CI
    baseUrl: 'http://localhost:5000',
    // your existing tests are under cypress/integration/*.js
    specPattern: 'cypress/integration/**/*.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log('using on: ', on)
      console.log('using config: ', config)
      return config
    },
  },
  video: false,
}
