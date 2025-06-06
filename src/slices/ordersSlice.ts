import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { orderBurgerApi, getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
};

const initialState: TOrdersState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  orderModalData: null,
  orderRequest: false
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const fetchFeeds = createAsyncThunk(
  'orders/feeds',
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  'orders/user',
  async () => await getOrdersApi()
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setCurrentOrder: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        const orderNumber = parseInt(action.payload);
        const order =
          state.orders.find((order) => order.number === orderNumber) ||
          (state.userOrders &&
            state.userOrders.find((order) => order.number === orderNumber)) ||
          null;
        state.currentOrder = order;
      }
    },
    closeOrderRequest: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrders: (state: TOrdersState) => state.orders,
    selectUserOrders: (state: TOrdersState) => state.userOrders,
    selectCurrentOrder: (state: TOrdersState) => state.currentOrder,
    selectTotalOrders: (state: TOrdersState) => state.total,
    selectTodayOrders: (state: TOrdersState) => state.totalToday,
    selectOrdersLoading: (state: TOrdersState) => state.isLoading,
    selectOrdersError: (state: TOrdersState) => state.error,
    selectOrderRequest: (state: TOrdersState) => state.orderRequest,
    selectOrderModalData: (state: TOrdersState) => state.orderModalData,
    // Мемоизированные селекторы
    selectFeedOrders: createSelector(
      [(state: TOrdersState) => state.orders],
      (orders) => orders
    ),
    selectOrderNumbers: createSelector(
      [(state: TOrdersState) => state.orders],
      (orders) => orders.map((order) => order.number)
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.orders) {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export const { clearCurrentOrder, closeOrderRequest, setCurrentOrder } =
  ordersSlice.actions;

export const {
  selectOrders,
  selectUserOrders,
  selectCurrentOrder,
  selectTotalOrders,
  selectTodayOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrderRequest,
  selectOrderModalData,
  selectFeedOrders,
  selectOrderNumbers
} = ordersSlice.selectors;

export default ordersSlice.reducer;
