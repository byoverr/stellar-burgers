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

import {IngredientsResponse, OrderResponse} from "../support/types";

const API_URL = Cypress.env('BURGER_API_URL');

describe('burger constructor test', () => {
    beforeEach(() => {
        // Mock auth tokens
        window.localStorage.setItem('refreshToken', 'refreshToken1');
        cy.setCookie('accessToken', 'accessToken1');

        // Mock API responses
        cy.fixture('ingredients.json').as('ingredientsData');
        cy.fixture('user.json').as('userData');
        cy.fixture('newOrder.json').as('orderData');

        cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');

        cy.visit('/');
        cy.wait('@getIngredients');
    });

    afterEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
    });

    // Загрузка компонентов конструктора
    it('should load ingredients and display constructor', () => {
        cy.get('[data-cy=ingredients_section]').should('exist');
        cy.get('[data-cy=constructor_section]').should('exist');
    });

    // Добавление ингредиента из списка ингредиентов в конструктор.
    it('should add bun and ingredient to constructor', () => {
        cy.get('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const bun = ingredients.data[0]; // Первый элемент - булка
            const ingredient = ingredients.data[4]; // Какой-то ингредиент

            cy.get(`[data-cy="ingredient_add_button_${bun._id}"]`).find('button').click();
            cy.get(`[data-cy="ingredient_add_button_${ingredient._id}"]`).find('button').click();

            // Проверяем что булка и ингредиент добавились в конструктор
            cy.get('[data-cy="constructor_bun_top"]').should('contain', bun.name);
            cy.get('[data-cy="constructor_bun_bottom"]').should('contain', bun.name);
            cy.get(`[data-cy="constructor_ingredient_${ingredient._id}"]`).should('contain', ingredient.name);
        });
    });

    // Открытие и закрытие модального окна с описанием ингредиента.
    it('should open and close ingredient modal', () => {
        cy.get('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const ingredient = ingredients.data[1]; // Второй элемент - начинка

            cy.get(`[data-cy="ingredient_${ingredient._id}"]`).click();

            // Проверяем модальное окно
            cy.get(`[data-cy="ingredient_${ingredient._id}_modal"]`).should('exist').should('contain', ingredient.name);

            // Закрываем через крестик
            cy.get('[data-cy="modal_close"]').click();
            cy.get(`[data-cy="ingredient_${ingredient._id}_modal"]`).should('not.exist');

            // Открываем снова и закрываем через оверлей
            cy.get(`[data-cy="ingredient_${ingredient._id}"]`).click();
            cy.get('[data-cy="modal_overlay"]').click({ force: true });
            cy.get(`[data-cy="ingredient_${ingredient._id}_modal"]`).should('not.exist');
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

        cy.get('@getIngredients').its('response.body').then((ingredients: IngredientsResponse) => {
            const bun = ingredients.data[0]; // булка
            const ingredient = ingredients.data[3]; // ингредиент

            cy.get(`[data-cy="ingredient_add_button_${bun._id}"]`).find('button').click();
            cy.get(`[data-cy="ingredient_add_button_${ingredient._id}"]`).find('button').click();

        });

        cy.get('[data-cy="order_submit_btn"]').find('button').click();

        cy.wait('@createOrder').then((interception) => {
            const order = interception.response?.body as OrderResponse;
            cy.get('[data-cy="order_number"]').should('contain', order.order.number);
        });

        cy.get('[data-cy="modal_close"]').click();

        cy.get('[data-cy="constructor_bun_top_empty"]').should('contain', 'Выберите булки');
        cy.get('[data-cy="constructor_ingredients"]').should('contain', 'Выберите начинку');
    });
});
