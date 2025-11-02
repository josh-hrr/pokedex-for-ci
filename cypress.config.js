module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log("using on: ", on)
      console.log("using config: ", config)
    },
  },
}
