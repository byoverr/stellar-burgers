import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { TIngredient, TIngredientUnique } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../services/store';

type TBuilderState = {
  bun: TIngredient | null;
  ingredients: TIngredientUnique[];
};

const initialState: TBuilderState = {
  bun: null,
  ingredients: []
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredientUnique>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: uuidv4()
        }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex > state.ingredients.length
      ) {
        return;
      }

      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearBuilder: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Селектор всего стейта builder
export const selectBuilderState = (state: RootState) => state.builder;

// Селекторы
export const selectBuilderItems = createSelector(
  selectBuilderState,
  (builder) => ({
    bun: builder.bun,
    ingredients: builder.ingredients
  })
);

export const selectBun = createSelector(
  selectBuilderState,
  (builder) => builder.bun
);

export const selectIngredients = createSelector(
  selectBuilderState,
  (builder) => builder.ingredients
);

// Экспорт действий
export const { addIngredient, removeIngredient, moveIngredient, clearBuilder } =
  builderSlice.actions;

export { builderSlice };

export default builderSlice.reducer;
