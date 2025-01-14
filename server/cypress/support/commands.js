// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
require('cypress-file-upload');

// -- This is a parent command --
Cypress.Commands.add('login', (user) => {
  cy.clearLocalStorage().then(() => {
    cy.visit('/');
    cy.clearCookies();
    cy.contains('Login').click();
    cy.get('input[name=username]').type(user.username);
    cy.get('input[name=password]').type(user.password);
    cy.get('button').click();
    cy.url().should('include', '/myVMT/');
  });
  // CANT GET THE CODE BELOW TO WORK -- want to do it programitcally - not through the UI
  // cy.request({
  //   url: 'localhost:3001/auth/login',
  //   method: 'POST',
  //   body: user
  // })
  // cy.visit('/')
});

Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click({ force: true });
  cy.clearCookies();
  cy.wait(1000);
});

Cypress.Commands.add('getTestElement', (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
