import { Selectors } from './selectors';

declare global {
    namespace Cypress {
        interface Chainable {
            addIngredientToConstructor(id: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('addIngredientToConstructor', (id: string) => {
    cy.get(Selectors.INGREDIENT_ADD_BUTTON(id)).find('button').click();
});
