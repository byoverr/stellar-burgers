export const Selectors = {
    INGREDIENTS_SECTION: '[data-cy=ingredients_section]',
    CONSTRUCTOR_SECTION: '[data-cy=constructor_section]',
    INGREDIENT_ITEM: (id: string) => `[data-cy="ingredient_${id}"]`,
    INGREDIENT_ADD_BUTTON: (id: string) => `[data-cy="ingredient_add_button_${id}"]`,
    CONSTRUCTOR_BUN_TOP: '[data-cy="constructor_bun_top"]',
    CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor_bun_bottom"]',
    CONSTRUCTOR_INGREDIENT: (id: string) => `[data-cy="constructor_ingredient_${id}"]`,
    MODAL: (id: string) => `[data-cy^="ingredient_${id}_modal"]`,
    MODAL_CLOSE: '[data-cy="modal_close"]',
    MODAL_OVERLAY: '[data-cy="modal_overlay"]',
    ORDER_SUBMIT_BTN: '[data-cy="order_submit_btn"]',
    ORDER_NUMBER: '[data-cy="order_number"]',
    CONSTRUCTOR_BUN_TOP_EMPTY: '[data-cy="constructor_bun_top_empty"]',
    CONSTRUCTOR_INGREDIENTS_LIST: '[data-cy="constructor_ingredients"]'
};
