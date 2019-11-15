import { combineReducers } from 'redux';
import productsReducer from './productsReducer';
import cartReducer from "./cartReducer";
import authReducer from './authReducer';
import stripeReducer from './stripeReducer';

export default combineReducers({
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    stripe: stripeReducer,
});
