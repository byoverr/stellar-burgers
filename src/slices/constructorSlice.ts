import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { TIngredient, TIngredientUnique } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
    items: {
        bun: TIngredient | null;
        ingredients: TIngredientUnique[];
    };
};

const initialState: TConstructorState = {
    items: {
        bun: null,
        ingredients: []
    }
};

export const constructorSlice = createSlice({
    name: 'constructor',
    initialState,
    reducers: {
        addIngredient: {
            reducer: (state, action: PayloadAction<TIngredient>) => {
                if (action.payload.type === 'bun') {
                    state.items.bun = action.payload;
                } else {
                    state.items.ingredients.push({
                        ...action.payload,
                        uniqueId: uuidv4()
                    });
                }
            },
            prepare: (ingredient: TIngredient) => ({
                payload: ingredient
            })
        },
        removeIngredient: (state, action: PayloadAction<string>) => {
            state.items.ingredients = state.items.ingredients.filter(
                (item) => item.uniqueId !== action.payload
            );
        },
        moveIngredient: (
            state,
            action: PayloadAction<{ fromIndex: number; toIndex: number }>
        ) => {
            const { fromIndex, toIndex } = action.payload;
            const [movedItem] = state.items.ingredients.splice(fromIndex, 1);
            state.items.ingredients.splice(toIndex, 0, movedItem);
        },
        clearConstructor: (state) => {
            state.items = initialState.items;
        }
    },
    selectors: {
        selectConstructorItems: (state: TConstructorState) => state.items,
        selectBun: createSelector(
            [(state: TConstructorState) => state.items.bun],
            (bun) => bun
        ),
        selectIngredients: createSelector(
            [(state: TConstructorState) => state.items.ingredients],
            (ingredients) => ingredients
        )
    }
});

// Экспорт действий
export const {
    addIngredient,
    removeIngredient,
    moveIngredient,
    clearConstructor
} = constructorSlice.actions;

// Экспорт селекторов
export const {
    selectConstructorItems,
    selectBun,
    selectIngredients
} = constructorSlice.selectors;

export default constructorSlice.reducer;
