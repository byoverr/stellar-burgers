import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';
import userReducer from '../slices/usersSlice';
import builderReducer from '../slices/builderSlice';
import modalReducer from '../slices/modalSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  builder: builderReducer,
  orders: ordersReducer,
  modal: modalReducer,
  user: userReducer
});

export default rootReducer;
