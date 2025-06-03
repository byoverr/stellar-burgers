import {
  modalSlice,
  openDetailsModal,
  closeDetailsModal,
  openOrderModal,
  closeOrderModal,
  selectIsDetailsModalOpen,
  selectIsOrderModalOpen
} from './modalSlice';
import type { RootState } from '../services/store';

describe('modalSlice', () => {
  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(modalSlice.getInitialState()).toEqual({
        isDetailsModalOpen: false,
        isOrderModalOpen: false
      });
    });
  });

  describe('reducers', () => {
    it('should handle openDetailsModal', () => {
      const state = modalSlice.reducer(undefined, openDetailsModal());
      expect(state.isDetailsModalOpen).toBe(true);
      expect(state.isOrderModalOpen).toBe(false);
    });

    it('should handle closeDetailsModal', () => {
      const initialState = {
        isDetailsModalOpen: true,
        isOrderModalOpen: false
      };
      const state = modalSlice.reducer(initialState, closeDetailsModal());
      expect(state.isDetailsModalOpen).toBe(false);
    });

    it('should handle openOrderModal', () => {
      const state = modalSlice.reducer(undefined, openOrderModal());
      expect(state.isOrderModalOpen).toBe(true);
      expect(state.isDetailsModalOpen).toBe(false);
    });

    it('should handle closeOrderModal', () => {
      const initialState = {
        isDetailsModalOpen: false,
        isOrderModalOpen: true
      };
      const state = modalSlice.reducer(initialState, closeOrderModal());
      expect(state.isOrderModalOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    const mockState: RootState = {
      modal: {
        isDetailsModalOpen: true,
        isOrderModalOpen: false
      },

      ingredients: {} as any,
      builder: {} as any,
      orders: {} as any,
      user: {} as any
    };

    it('selectIsDetailsModalOpen should return correct value', () => {
      expect(selectIsDetailsModalOpen(mockState)).toBe(true);
    });

    it('selectIsOrderModalOpen should return correct value', () => {
      expect(selectIsOrderModalOpen(mockState)).toBe(false);
    });

    it('selectors should work with initial state', () => {
      const initialState: RootState = {
        ...mockState,
        modal: modalSlice.getInitialState()
      };
      expect(selectIsDetailsModalOpen(initialState)).toBe(false);
      expect(selectIsOrderModalOpen(initialState)).toBe(false);
    });
  });

  describe('extra cases', () => {
    it('should return current state for unknown action', () => {
      const state = modalSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(modalSlice.getInitialState());
    });

    it('should maintain referential equality when no changes', () => {
      const initialState = modalSlice.getInitialState();
      const state = modalSlice.reducer(initialState, {
        type: 'UNKNOWN_ACTION'
      });
      expect(state).toBe(initialState);
    });
  });
});
