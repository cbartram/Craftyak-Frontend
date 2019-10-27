/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import { get } from '../util';
import {ADD_TO_CART} from "../constants";
import {REMOVE_FROM_CART} from "../constants";

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const getProducts = () => async (dispatch, getState) => {
    await get(constants.GET_ALL_PRODUCTS_ENDPOINT, constants.GET_PRODUCTS_REQUEST, constants.GET_PRODUCTS_SUCCESS, constants.GET_PRODUCTS_FAILURE, dispatch, getState, true);
};

/**
 * Action to add a new item to a users cart
 * @param item Product that the user chose to add to their cart
 */
export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item
});


/**
 * Removes an item from the shopping cart
 * @param item Product product that hte user chose to remove from the cart. Note the only
 * required property of this object is id. Ex { id: 3 }
 * @returns {{payload: *, type: *}}
 */
export const removeFromCart = (item) => ({
   type: REMOVE_FROM_CART,
   payload: item
});
