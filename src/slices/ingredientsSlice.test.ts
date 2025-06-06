import { fetchIngredients } from './ingredientsSlice';
import { getIngredientsApi } from '@api';
import {
  ingredientsSlice,
  selectIngredients,
  selectLoading,
  selectError
} from './ingredientsSlice';
import { mockIngredients } from './__mocks__/ingredientsMock';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(ingredientsSlice.getInitialState()).toEqual({
        items: [],
        loading: false,
        error: null
      });
    });
  });

  describe('async thunk fetchIngredients', () => {
    it('should handle pending state', () => {
      const state = ingredientsSlice.reducer(
        undefined,
        fetchIngredients.pending('')
      );
      expect(state).toEqual({
        items: [],
        loading: true,
        error: null
      });
    });

    it('should handle fulfilled state', () => {
      const state = ingredientsSlice.reducer(
        undefined,
        fetchIngredients.fulfilled(mockIngredients, '')
      );
      expect(state).toEqual({
        items: mockIngredients,
        loading: false,
        error: null
      });
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Network error';
      const state = ingredientsSlice.reducer(
        undefined,
        fetchIngredients.rejected(new Error(errorMessage), '')
      );
      expect(state).toEqual({
        items: [],
        loading: false,
        error: errorMessage
      });
    });

    it('should call getIngredientsApi', async () => {
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchIngredients()(dispatch, getState, undefined);

      expect(getIngredientsApi).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectors', () => {
    const mockState = {
      ingredients: {
        items: mockIngredients,
        loading: true,
        error: 'Test error'
      }
    };

    it('selectIngredients should return items', () => {
      expect(selectIngredients(mockState)).toEqual(mockIngredients);
    });

    it('selectLoading should return loading state', () => {
      expect(selectLoading(mockState)).toBe(true);
    });

    it('selectError should return error', () => {
      expect(selectError(mockState)).toBe('Test error');
    });

    it('selectors should work with empty state', () => {
      const emptyState = { ingredients: ingredientsSlice.getInitialState() };
      expect(selectIngredients(emptyState)).toEqual([]);
      expect(selectLoading(emptyState)).toBe(false);
      expect(selectError(emptyState)).toBeNull();
    });
  });

  describe('extra cases', () => {
    it('should not modify state for unknown action', () => {
      const state = ingredientsSlice.reducer(undefined, {
        type: 'UNKNOWN_ACTION'
      });
      expect(state).toEqual(ingredientsSlice.getInitialState());
    });

    it('should preserve items when loading starts', () => {
      const initialStateWithItems = {
        items: mockIngredients,
        loading: false,
        error: null
      };
      const state = ingredientsSlice.reducer(
        initialStateWithItems,
        fetchIngredients.pending('')
      );
      expect(state.items).toEqual(mockIngredients);
    });
  });
});
