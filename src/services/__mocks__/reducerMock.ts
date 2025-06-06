export const mockStore = {
  ingredients: {
    items: [],
    loading: false,
    error: null
  },
  builder: {
    bun: null,
    ingredients: []
  },
  orders: {
    orders: [],
    userOrders: [],
    currentOrder: null,
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
    orderModalData: null,
    orderRequest: false
  },
  modal: {
    isDetailsModalOpen: false,
    isOrderModalOpen: false
  },
  user: {
    data: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInit: false
  }
};
