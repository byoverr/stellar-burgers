import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/ordersSlice';
import userReducer from '../slices/usersSlice';
import constructorReducer from '../slices/constructorSlice';

const rootReducer = combineReducers({
    ingredients: ingredientsReducer,
    constructor: constructorReducer,
    orders: ordersReducer,
    user: userReducer
});

export default rootReducer;
