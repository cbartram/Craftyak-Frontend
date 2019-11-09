/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import auth0 from 'auth0-js';
import { get, post } from '../util';
import {ADD_TO_CART} from "../constants";
import {REMOVE_FROM_CART} from "../constants";
import {UPDATE_SORT_OPTIONS} from "../constants";
import {FILTER_PRODUCTS} from "../constants";
import {REMOVE_ALL_FROM_CART} from "../constants";
import {UPDATE_QUANTITY} from "../constants";
import {REQUEST_OAUTH_TOKEN} from "../constants";
import {OAUTH_ENDPOINT} from "../constants";
import {CLIENT_ID} from "../constants";
import {CLIENT_SECRET} from "../constants";
import {OAUTH_TOKEN_SUCCESS} from "../constants";

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const getProducts = () => async (dispatch, getState) => {
    await get(constants.GET_ALL_PRODUCTS_ENDPOINT, constants.GET_PRODUCTS_REQUEST, constants.GET_PRODUCTS_SUCCESS, constants.GET_PRODUCTS_FAILURE, dispatch, getState, false);
};

export const getOAuthToken = () => async (dispatch, getState) => {
    const params = {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: 'https://quickstarts/api'
    };

    const searchParams = Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');

   const body = await (await fetch(OAUTH_ENDPOINT, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
       },
       body: searchParams
   })).json();

   dispatch({ type: OAUTH_TOKEN_SUCCESS, payload: body });
};

/**
 * Creates a new stripe payment and session
 * @param payload Object the products that are being created
 * @returns {Function}
 */
export const createStripePayment = (payload) => async (dispatch, getState) => {
  await post(payload, constants.CREATE_PAYMENT_ENDPOINT, constants.CREATE_PAYMENT_REQUEST, constants.CREATE_PAYMENT_SUCCESS, constants.CREATE_PAYMENT_FAILURE, dispatch, getState, true);
};

/**
 * Creates a POST request to create a new order
 * @param payload
 * @returns {Function}
 */
export const checkout = (payload) => async (dispatch, getState) => {
    await post(payload, constants.CREATE_ORDER_ENDPOINT, constants.CREATE_ORDER_REQUEST, constants.CREATE_ORDER_SUCCESS, constants.CREATE_ORDER_FAILURE, dispatch, getState, false);
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


/**
 * Removes all of a single item from the cart
 * @param item
 * @returns {{payload: *, type: *}}
 */
export const removeAllFromCart = (item) => ({
    type: REMOVE_ALL_FROM_CART,
    payload: item
});


/**
 * Updates the quantity of a single item in the cart
 * @param payload  Object { id: items uuid, value: quantity value to set }
 * @returns {{payload: *, type: *}}
 */
export const updateQuantity = (payload) => ({
    type: UPDATE_QUANTITY,
    payload,
});

/**
 * Filters the list of products given a boolean checklist
 * of viable products to include
 * @param payload Object { mug: false, cup: true, sticker: false ... }
 * @returns {{payload: *, type: *}}
 */
export const filterProducts = (payload) => ({
   type: FILTER_PRODUCTS,
   payload,
});


/**
 * Handles updating the sort of the page when users
 * change the sort dropdown from the navbar
 * @param payload
 * @returns {{payload: *, type: *}}
 */
export const updateSortOptions = (payload) => ({
    type: UPDATE_SORT_OPTIONS,
    payload
});
