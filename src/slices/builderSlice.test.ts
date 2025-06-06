import {
  builderSlice,
  selectBuilderItems,
  selectBun,
  selectIngredients,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBuilder
} from './builderSlice';
import { RootState } from '../services/store';
import { mockBun, mockIngredient } from './__mocks__/builderMock';

describe('builderSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(builderSlice.reducer(undefined, { type: '' })).toEqual(
        initialState
      );
    });

    it('should handle addIngredient for bun', () => {
      const action = addIngredient(mockBun);
      const state = builderSlice.reducer(initialState, action);
      expect(state.bun).toMatchObject(mockBun);
      expect(state.bun).toHaveProperty('uniqueId');
    });

    it('should handle addIngredient for non-bun', () => {
      const action = addIngredient(mockIngredient);
      const state = builderSlice.reducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockIngredient,
        uniqueId: expect.any(String)
      });
    });

    it('should handle removeIngredient', () => {
      const addedState = builderSlice.reducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const ingredientToRemove = addedState.ingredients[0];

      const state = builderSlice.reducer(
        addedState,
        removeIngredient(ingredientToRemove.uniqueId)
      );

      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle moveIngredient', () => {
      const firstIngredient = { ...mockIngredient, uniqueId: '1' };
      const secondIngredient = { ...mockIngredient, uniqueId: '2' };

      const initialStateWithIngredients = {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      };

      const state = builderSlice.reducer(
        initialStateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0].uniqueId).toBe('2');
      expect(state.ingredients[1].uniqueId).toBe('1');
    });

    it('should handle clearBuilder', () => {
      const stateWithItems = {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, uniqueId: '1' }]
      };

      const state = builderSlice.reducer(stateWithItems, clearBuilder());

      expect(state).toEqual(initialState);
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      builder: {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, uniqueId: '1' }]
      },
      ingredients: {} as any,
      orders: {} as any,
      modal: {} as any,
      user: {} as any
    };

    it('should selectBuilderItems', () => {
      expect(selectBuilderItems(mockState)).toEqual({
        bun: mockBun,
        ingredients: [{ ...mockIngredient, uniqueId: '1' }]
      });
    });

    it('should selectBun', () => {
      expect(selectBun(mockState)).toEqual(mockBun);
    });

    it('should selectIngredients', () => {
      expect(selectIngredients(mockState)).toEqual([
        { ...mockIngredient, uniqueId: '1' }
      ]);
    });

    it('should return empty state when no items', () => {
      const emptyState: RootState = {
        ...mockState,
        builder: initialState
      };

      expect(selectBuilderItems(emptyState)).toEqual(initialState);
      expect(selectBun(emptyState)).toBeNull();
      expect(selectIngredients(emptyState)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should not add duplicate bun', () => {
      const firstAction = addIngredient(mockBun);
      const firstState = builderSlice.reducer(initialState, firstAction);

      const secondBun = { ...mockBun, _id: '3' };
      const secondState = builderSlice.reducer(
        firstState,
        addIngredient(secondBun)
      );

      expect(secondState.bun?._id).toBe('3');
    });

    it('should not fail when removing non-exist ingredient', () => {
      const state = builderSlice.reducer(
        initialState,
        removeIngredient('something')
      );

      expect(state).toEqual(initialState);
    });

    it('should not fail when moving invalid indexes', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [{ ...mockIngredient, uniqueId: '1' }]
      };

      const state = builderSlice.reducer(
        stateWithItems,
        moveIngredient({ fromIndex: 5, toIndex: 10 })
      );
      console.log(state);

      expect(state.ingredients).toHaveLength(1);
    });
  });
});
