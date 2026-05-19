/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setMockTokens(): Chainable<void>;
      clearMockTokens(): Chainable<void>;
      addIngredient(index: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setMockTokens', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'testRefreshToken');
    win.localStorage.setItem('accessToken', 'testAccessToken');
  });

  cy.setCookie('accessToken', 'testAccessToken');
  cy.log('Моковые токены установлены');
});

Cypress.Commands.add('clearMockTokens', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
    win.localStorage.removeItem('accessToken');
  });

  cy.clearCookie('accessToken');
  cy.log('Моковые токены очищены');
});

Cypress.Commands.add('addIngredient', (index: number) => {
  cy.get(`[data-cy="ingredient_${index}"]`).find('button').click();
});

export {};
