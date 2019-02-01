// const user = require('../fixtures/user')
// let url;
// describe('temporary room', function() {
//   beforeEach(function() {
//     cy.task('clearDB')
//     cy.window().then((win) => {
//       win.sessionStorage.clear()
//       cy.visit('/')
//     })
//   })
//   it('creates a temp user and room and then saves', function() {
//     cy.contains('Try out a Workspace').click()
//     cy.url().should('include', 'explore')
//     cy.get('input').type(user.username)
//     cy.getTestElement('temp-geogebra').click()
//     // cy.wait(3000)
//     cy.get('.ggbtoolbarpanel').should('exist')
//     cy.url({log: true}).then(res => url = res)
//     cy.getTestElement('save-temp').click()
//     cy.get('input[name=password]').type('555')
//     cy.getTestElement('submit-signup').click();
//     cy.getTestElement('nav-My VMT').click()
//     cy.getTestElement('tab').contains('Rooms').click()
//     cy.getTestElement('box-list').should('have.length', 1)
//   })

//   it('creates another user and joins the same room', function(){
//     cy.window().then((win) => {
//       win.sessionStorage.clear()
//       cy.visit('/')
//       cy.visit(url)
//       cy.get('input').type('geordi')
//       cy.get('.button__Button__3QQYz').click()
//       cy.get('.ggbtoolbarpanel')
//       cy.getTestElement('current-members').children().should('have.length', 1)
//       cy.getTestElement('current-members').contains('geordi')
//     })
//   })
// })
