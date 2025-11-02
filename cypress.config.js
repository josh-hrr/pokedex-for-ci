module.exports = {
  e2e: {
  // baseUrl used by tests to visit the running app in CI
      baseUrl: 'http://localhost:5000',
        // prefer tests in cypress/e2e; keep integration as a fallback
        specPattern: [
          'cypress/e2e/**/*.js',
          'cypress/integration/**/*.js'
        ],
        setupNodeEvents(on, config) {
          console.log('using on: ', on)
          console.log('using config: ', config)
          return config
        },
      },
  video: false,
}
