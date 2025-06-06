// Интеграционные тесты на Cypress написаны для страницы конструктора бургера:
//
// Созданы моковые данные для ингредиентов (например, в файле ingredients.json);
// Настроен перехват запроса на эндпоинт 'api/ingredients’, в ответе на который возвращаются созданные ранее моковые данные.
// Протестировано добавление ингредиента из списка в конструктор. Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок.

// Протестирована работа модальных окон:
// открытие модального окна ингредиента;
// закрытие по клику на крестик;
// закрытие по клику на оверлей (желательно);

// Создание заказа:
// Созданы моковые данные ответа на запрос данных пользователя.
// Созданы моковые данные ответа на запрос создания заказа.
// Подставляются моковые токены авторизации.
// Собирается бургер.
// Вызывается клик по кнопке «Оформить заказ».
// Проверяется, что модальное окно открылось и номер заказа верный.
// Закрывается модальное окно и проверяется успешность закрытия.
// Проверяется, что конструктор пуст.

import { IngredientsResponse, OrderResponse } from "../support/types";
import { Selectors } from "../support/selectors";

const API_URL = Cypress.env('BURGER_API_URL');

describe('burger constructor test', () => {
    beforeEach(() => {
        // Mock auth tokens
        window.localStorage.setItem('refreshToken', 'refreshToken1');
        cy.setCookie('accessToken', 'accessToken1');

        // Mock API responses
        cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');

        cy.visit('/');
    });

    afterEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
    });

    // Загрузка компонентов конструктора
    it('should load ingredients and display constructor', () => {
        cy.get(Selectors.INGREDIENTS_SECTION).should('exist');
        cy.get(Selectors.CONSTRUCTOR_SECTION).should('exist');
    });

    // Добавление ингредиента из списка ингредиентов в конструктор.
    it('should add bun and ingredient to constructor', () => {
        cy.wait('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const bun = ingredients.data[0];
            const ingredient = ingredients.data[4];

            cy.addIngredientToConstructor(bun._id);
            cy.addIngredientToConstructor(ingredient._id);

            cy.get(Selectors.CONSTRUCTOR_BUN_TOP).should('contain', bun.name);
            cy.get(Selectors.CONSTRUCTOR_BUN_BOTTOM).should('contain', bun.name);
            cy.get(Selectors.CONSTRUCTOR_INGREDIENT(ingredient._id)).should('contain', ingredient.name);
        });
    });

    // Открытие и закрытие модального окна с описанием ингредиента.
    it('should open and close ingredient modal', () => {
        cy.wait('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const ingredient = ingredients.data[1];

            cy.get(Selectors.INGREDIENT_ITEM(ingredient._id)).click();
            cy.get(Selectors.MODAL(ingredient._id))
                .should('exist')
                .should('contain', ingredient.name);

            cy.get(Selectors.MODAL_CLOSE).click();
            cy.get(Selectors.MODAL(ingredient._id)).should('not.exist');

            cy.get(Selectors.INGREDIENT_ITEM(ingredient._id)).click();
            cy.get(Selectors.MODAL_OVERLAY).click({ force: true });
            cy.get(Selectors.MODAL(ingredient._id)).should('not.exist');
        });
    });

    // Процесс создания заказа
    it('should create new order', () => {
        cy.fixture('newOrder.json').then((orderMock: OrderResponse) => {
            cy.intercept('POST', `${API_URL}/orders`, {
                statusCode: 200,
                body: orderMock
            }).as('createOrder');
        });

        cy.wait('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const bun = ingredients.data[0];
            const ingredient = ingredients.data[3];

            cy.addIngredientToConstructor(bun._id);
            cy.addIngredientToConstructor(ingredient._id);
        });

        cy.get(Selectors.ORDER_SUBMIT_BTN).find('button').click();

        cy.wait('@createOrder').then((interception) => {
            const order = interception.response?.body as OrderResponse;
            cy.get(Selectors.ORDER_NUMBER).should('contain', order.order.number);
        });

        cy.get(Selectors.MODAL_CLOSE).click();
        cy.get(Selectors.CONSTRUCTOR_BUN_TOP_EMPTY).should('contain', 'Выберите булки');
        cy.get(Selectors.CONSTRUCTOR_INGREDIENTS_LIST).should('contain', 'Выберите начинку');
    });
});
