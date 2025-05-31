import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import { orderBurgerApi, getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
    orders: TOrder[];
    userOrders: TOrder[] | null;
    currentOrder: TOrder | null;
    total: number;
    totalToday: number;
    isLoading: boolean;
    error: string | null;
};

const initialState: TOrdersState = {
    orders: [],
    userOrders: null,
    currentOrder: null,
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
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

        // Мемоизированные селекторы
        selectFeedOrders: createSelector(
            [(state: TOrdersState) => state.orders],
            (orders) => orders
        ),
        selectOrderNumbers: createSelector(
            [(state: TOrdersState) => state.orders],
            (orders) => orders.map(order => order.number)
        )
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload.order;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create order';
            })
            .addCase(fetchFeeds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFeeds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalToday = action.payload.totalToday;
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

// Экспорт действий
export const { clearCurrentOrder } = ordersSlice.actions;

// Экспорт селекторов
export const {
    selectOrders,
    selectUserOrders,
    selectCurrentOrder,
    selectTotalOrders,
    selectTodayOrders,
    selectOrdersLoading,
    selectOrdersError,
    selectFeedOrders,
    selectOrderNumbers
} = ordersSlice.selectors;

export default ordersSlice.reducer;
