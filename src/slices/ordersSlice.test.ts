import {
  createOrder,
  fetchFeeds,
  fetchUserOrders,
  ordersSlice,
  clearCurrentOrder,
  closeOrderRequest,
  setCurrentOrder
} from './ordersSlice';
import { orderBurgerApi, getFeedsApi, getOrdersApi } from '@api';
import { mockFeedResponse, mockOrder } from './__mocks__/ordersMock';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('ordersSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(ordersSlice.getInitialState()).toEqual({
        orders: [],
        userOrders: [],
        currentOrder: null,
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
        orderModalData: null,
        orderRequest: false
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearCurrentOrder', () => {
      const state = ordersSlice.reducer(
        { ...ordersSlice.getInitialState(), currentOrder: mockOrder },
        clearCurrentOrder()
      );
      expect(state.currentOrder).toBeNull();
    });

    it('should handle closeOrderRequest', () => {
      const state = ordersSlice.reducer(
        {
          ...ordersSlice.getInitialState(),
          orderRequest: true,
          orderModalData: mockOrder
        },
        closeOrderRequest()
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });

    describe('setCurrentOrder', () => {
      const stateWithOrders = {
        ...ordersSlice.getInitialState(),
        orders: [mockOrder],
        userOrders: [{ ...mockOrder, number: 54321 }]
      };

      it('should set currentOrder from orders', () => {
        const state = ordersSlice.reducer(
          stateWithOrders,
          setCurrentOrder('12345')
        );
        expect(state.currentOrder?.number).toBe(12345);
      });

      it('should set currentOrder from userOrders', () => {
        const state = ordersSlice.reducer(
          stateWithOrders,
          setCurrentOrder('54321')
        );
        expect(state.currentOrder?.number).toBe(54321);
      });

      it('should set null for non-existent order', () => {
        const state = ordersSlice.reducer(
          stateWithOrders,
          setCurrentOrder('99999')
        );
        expect(state.currentOrder).toBeNull();
      });

      it('should handle invalid order number', () => {
        const state = ordersSlice.reducer(
          stateWithOrders,
          setCurrentOrder('invalid')
        );
        expect(state.currentOrder).toBeNull();
      });
    });
  });

  describe('async thunks', () => {
    describe('createOrder', () => {
      it('should handle pending', () => {
        const state = ordersSlice.reducer(
          undefined,
          createOrder.pending('', ['ingredient1', 'ingredient2'])
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: true,
          orderRequest: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = ordersSlice.reducer(
          undefined,
          createOrder.fulfilled(
            { success: true, order: mockOrder, name: 'test' }, // полный payload
            '',
            ['ingredient1', 'ingredient2']
          )
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          orderRequest: false,
          orderModalData: mockOrder
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Failed to create order';
        const state = ordersSlice.reducer(
          undefined,
          createOrder.rejected(new Error(errorMessage), '', [
            'ingredient1',
            'ingredient2'
          ])
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          orderRequest: false,
          error: errorMessage
        });
      });

      it('should call orderBurgerApi', async () => {
        (orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });
        const dispatch = jest.fn();
        const getState = jest.fn();

        await createOrder(['ingredient1', 'ingredient2'])(
          dispatch,
          getState,
          undefined
        );
        expect(orderBurgerApi).toHaveBeenCalledWith([
          'ingredient1',
          'ingredient2'
        ]);
      });
    });

    describe('fetchFeeds', () => {
      it('should handle pending', () => {
        const state = ordersSlice.reducer(undefined, fetchFeeds.pending(''));
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = ordersSlice.reducer(
          undefined,
          fetchFeeds.fulfilled({ ...mockFeedResponse, success: true }, '')
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          orders: mockFeedResponse.orders,
          total: mockFeedResponse.total,
          totalToday: mockFeedResponse.totalToday
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Failed to fetch feeds';
        const state = ordersSlice.reducer(
          undefined,
          fetchFeeds.rejected(new Error(errorMessage), '')
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call getFeedsApi', async () => {
        (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedResponse);
        const dispatch = jest.fn();
        const getState = jest.fn();

        await fetchFeeds()(dispatch, getState, undefined);
        expect(getFeedsApi).toHaveBeenCalledTimes(1);
      });
    });

    describe('fetchUserOrders', () => {
      it('should handle pending', () => {
        const state = ordersSlice.reducer(
          undefined,
          fetchUserOrders.pending('')
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: true,
          error: null
        });
      });

      it('should handle fulfilled', () => {
        const state = ordersSlice.reducer(
          undefined,
          fetchUserOrders.fulfilled([mockOrder], '')
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          userOrders: [mockOrder]
        });
      });

      it('should handle rejected', () => {
        const errorMessage = 'Failed to fetch user orders';
        const state = ordersSlice.reducer(
          undefined,
          fetchUserOrders.rejected(new Error(errorMessage), '')
        );
        expect(state).toEqual({
          ...ordersSlice.getInitialState(),
          isLoading: false,
          error: errorMessage
        });
      });

      it('should call getOrdersApi', async () => {
        (getOrdersApi as jest.Mock).mockResolvedValue([mockOrder]);
        const dispatch = jest.fn();
        const getState = jest.fn();

        await fetchUserOrders()(dispatch, getState, undefined);
        expect(getOrdersApi).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      orders: {
        orders: [mockOrder],
        userOrders: [{ ...mockOrder, number: 54321 }],
        currentOrder: mockOrder,
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null,
        orderModalData: mockOrder,
        orderRequest: false
      }
    };

    it('selectOrders should return orders', () => {
      expect(ordersSlice.selectors.selectOrders(mockState)).toEqual([
        mockOrder
      ]);
    });

    it('selectUserOrders should return userOrders', () => {
      expect(ordersSlice.selectors.selectUserOrders(mockState)).toEqual([
        { ...mockOrder, number: 54321 }
      ]);
    });

    it('selectCurrentOrder should return currentOrder', () => {
      expect(ordersSlice.selectors.selectCurrentOrder(mockState)).toEqual(
        mockOrder
      );
    });

    it('selectTotalOrders should return total', () => {
      expect(ordersSlice.selectors.selectTotalOrders(mockState)).toBe(100);
    });

    it('selectTodayOrders should return totalToday', () => {
      expect(ordersSlice.selectors.selectTodayOrders(mockState)).toBe(10);
    });

    it('selectOrdersLoading should return isLoading', () => {
      expect(ordersSlice.selectors.selectOrdersLoading(mockState)).toBe(false);
    });

    it('selectOrdersError should return error', () => {
      expect(ordersSlice.selectors.selectOrdersError(mockState)).toBeNull();
    });

    it('selectOrderRequest should return orderRequest', () => {
      expect(ordersSlice.selectors.selectOrderRequest(mockState)).toBe(false);
    });

    it('selectOrderModalData should return orderModalData', () => {
      expect(ordersSlice.selectors.selectOrderModalData(mockState)).toEqual(
        mockOrder
      );
    });

    it('selectFeedOrders should return orders', () => {
      expect(ordersSlice.selectors.selectFeedOrders(mockState)).toEqual([
        mockOrder
      ]);
    });

    it('selectOrderNumbers should return order numbers', () => {
      expect(ordersSlice.selectors.selectOrderNumbers(mockState)).toEqual([
        12345
      ]);
    });
  });

  describe('extra cases', () => {
    it('should not modify state for unknown action', () => {
      const state = ordersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(ordersSlice.getInitialState());
    });

    it('should preserve other state when loading starts', () => {
      const initialState = {
        ...ordersSlice.getInitialState(),
        orders: [mockOrder],
        total: 100
      };
      const state = ordersSlice.reducer(initialState, fetchFeeds.pending(''));
      expect(state.orders).toEqual([mockOrder]);
      expect(state.total).toBe(100);
    });
  });
});
