describe('Pokedex', function() {
  it('frontpage can be opened', function () {
    cy.visit('/')
    cy.contains('pikachu')
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo')
  })
})