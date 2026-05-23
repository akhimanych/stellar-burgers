const SELECTORS = {
  BUN_NAME: 'Краторная булка N-200i',
  MAIN_NAME: 'Биокотлета из марсианской Магнолии',

  ADD_BUTTON: 'Добавить',
  CLOSE_BUTTON: '[data-cy="close-button"]',
  MODAL_OVERLAY: '[data-cy="modal-overlay"]',
  MODAL: '[data-cy="modal"]',

  CONSTRUCTOR: '[data-cy="burger-constructor"]',
  CONSTRUCTOR_BUN_TOP: '[data-cy="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
  CONSTRUCTOR_FILLINGS: '[data-cy="constructor-fillings"]',

  MODAL_TITLE: 'Детали ингредиента',
  ORDER_TITLE: 'идентификатор заказа',
  EMPTY_BUN: 'Выберите булки',
  EMPTY_FILLING: 'Выберите начинку',

  ORDER_BUTTON: 'Оформить заказ'
};

const TEST_DATA = {
  ORDER_NUMBER: '12345'
};

const API = {
  INGREDIENTS: '**/api/ingredients',
  USER: '**/api/auth/user',
  ORDERS: '**/api/orders'
};

describe('Проверка загрузки страницы', () => {
  beforeEach(() => {
    cy.intercept('GET', API.INGREDIENTS, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  it('страница должна загрузиться', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('Соберите бургер').should('exist');
  });
});

describe('Проверка загрузки данных', () => {
  it('должен загрузить ингредиенты', () => {
    cy.intercept('GET', API.INGREDIENTS).as('getIngredients');

    cy.visit('/');

    cy.wait('@getIngredients').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body).to.exist;
      expect(interception.response?.body).to.have.property('data');
      expect(interception.response?.body.data).to.be.an('array').and.not.be
        .empty;
    });
  });
});

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', API.INGREDIENTS, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', API.USER, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', API.ORDERS, {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      cy.contains(SELECTORS.BUN_NAME)
        .closest('li')
        .within(() => {
          cy.contains('button', SELECTORS.ADD_BUTTON).click();
        });

      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should(
        'contain',
        `${SELECTORS.BUN_NAME} (верх)`
      );

      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should(
        'contain',
        `${SELECTORS.BUN_NAME} (низ)`
      );
    });

    it('должен добавить начинку в конструктор', () => {
      cy.contains(SELECTORS.BUN_NAME)
        .closest('li')
        .within(() => {
          cy.contains('button', SELECTORS.ADD_BUTTON).click();
        });

      cy.contains(SELECTORS.MAIN_NAME)
        .closest('li')
        .within(() => {
          cy.contains('button', SELECTORS.ADD_BUTTON).click();
        });

      cy.get(SELECTORS.CONSTRUCTOR_FILLINGS).within(() => {
        cy.contains(SELECTORS.MAIN_NAME).should('exist');
      });
    });
  });

  describe('Работа модального окна ингредиента', () => {
    it('должен открыть модальное окно ингредиента при клике на него', () => {
      cy.contains(SELECTORS.BUN_NAME).closest('a').click();

      cy.get(SELECTORS.MODAL)
        .should('be.visible')
        .within(() => {
          cy.contains(SELECTORS.MODAL_TITLE).should('exist');
          cy.contains(SELECTORS.BUN_NAME).should('exist');
        });
    });

    it('должен закрыть модальное окно по клику на крестик', () => {
      cy.contains(SELECTORS.BUN_NAME).closest('a').click();

      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.CLOSE_BUTTON).click();

      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен закрыть модальное окно по клику на оверлей', () => {
      cy.contains(SELECTORS.BUN_NAME).closest('a').click();

      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });

      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен отображать данные именно того ингредиента, по которому кликнули', () => {
      cy.contains(SELECTORS.BUN_NAME).closest('a').click();

      cy.get(SELECTORS.MODAL)
        .should('be.visible')
        .within(() => {
          cy.contains(SELECTORS.MODAL_TITLE).should('exist');
          cy.contains(SELECTORS.BUN_NAME).should('exist');
          cy.contains(SELECTORS.MAIN_NAME).should('not.exist');
        });

      cy.get(SELECTORS.CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.contains(SELECTORS.MAIN_NAME).closest('a').click();

      cy.get(SELECTORS.MODAL)
        .should('be.visible')
        .within(() => {
          cy.contains(SELECTORS.MODAL_TITLE).should('exist');
          cy.contains(SELECTORS.MAIN_NAME).should('exist');
          cy.contains(SELECTORS.BUN_NAME).should('not.exist');
        });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'testRefreshToken');
          win.localStorage.setItem('accessToken', 'testAccessToken');
          win.document.cookie = 'accessToken=testAccessToken';
        }
      });

      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearMockTokens();
    });

    it('должен создать заказ и очистить конструктор', () => {
      cy.contains(SELECTORS.BUN_NAME)
        .closest('li')
        .within(() => {
          cy.contains('button', SELECTORS.ADD_BUTTON).click();
        });

      cy.contains(SELECTORS.MAIN_NAME)
        .closest('li')
        .within(() => {
          cy.contains('button', SELECTORS.ADD_BUTTON).click();
        });

      cy.contains(SELECTORS.ORDER_BUTTON).click();

      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL)
        .should('be.visible')
        .within(() => {
          cy.contains(SELECTORS.ORDER_TITLE).should('be.visible');
          cy.contains(TEST_DATA.ORDER_NUMBER).should('be.visible');
        });

      cy.get(SELECTORS.CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');

      cy.get(SELECTORS.CONSTRUCTOR).within(() => {
        cy.contains(SELECTORS.EMPTY_BUN).should('exist');
        cy.contains(SELECTORS.EMPTY_FILLING).should('exist');
      });
    });
  });
});
