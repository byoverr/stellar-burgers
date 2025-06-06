import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { mockStore as reducerMock } from './__mocks__/reducerMock';
import store from './store';

describe('store', () => {
  it('should initialize with state equal to reducerMock', () => {
    expect(store.getState()).toEqual(reducerMock);
  });

  it('should create new store with correct preloadedState', () => {
    const customStore = configureStore({
      reducer: rootReducer,
      preloadedState: reducerMock
    });
    expect(customStore.getState()).toEqual(reducerMock);
  });
});
