import type { TOrder } from '@utils-types';

export const mockOrder: TOrder = {
  _id: '683f00dbc2f30c001cb29a20',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Флюоресцентный люминесцентный био-марсианский бургер',
  createdAt: '2025-06-03T14:04:11.802Z',
  updatedAt: '2025-06-03T14:04:12.560Z',
  number: 12345
};

export const mockFeedResponse = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};
