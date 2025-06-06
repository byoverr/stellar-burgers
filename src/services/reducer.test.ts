import rootReducer from './reducer';
import { mockStore as reducerMock } from './__mocks__/reducerMock';
import { UnknownAction } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('should have the same structure as reducerMock', () => {
    const initialState = rootReducer(undefined, {} as UnknownAction);

    expect(initialState).toEqual({
      ingredients: expect.any(Object),
      builder: expect.any(Object),
      orders: expect.any(Object),
      modal: expect.any(Object),
      user: expect.any(Object)
    });
  });

  it('should return initial state equal to reducerMock when state is undefined', () => {
    const initialState = rootReducer(undefined, {} as UnknownAction);
    expect(initialState).toEqual(reducerMock);
  });

  it('should return same state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(reducerMock, action);
    expect(state).toEqual(reducerMock);
  });

  it('should return same state for empty action object', () => {
    const state = rootReducer(reducerMock, {} as UnknownAction);
    expect(state).toEqual(reducerMock);
  });

  it('should maintain referential equality for unchanged state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(reducerMock, action);
    expect(state).toBe(reducerMock);
  });
});
