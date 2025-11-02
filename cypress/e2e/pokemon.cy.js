/* eslint-env mocha, cypress */

describe('Pokedex Pokemon', () => {
  it('make sure the list of pokemons is displayed', () => {
    // visit the app root
    cy.visit('/')

    // ensure the list is visible
    cy.get('.list-item:nth-child(1)').should('be.visible')

  })

  it('make sure the pokemon card is visible', () => {
    // visit the app root
    cy.visit('/')

    // ensure the list is visible
    cy.get('.list-item:nth-child(1)').should('be.visible')
    cy.get('.list-item:nth-child(1)').click()
    cy.url().should('include', '/pokemon/bulbasaur')
    cy.get('.pokemon-ability-name').should('contain.text', 'overgrow')
  })

})
