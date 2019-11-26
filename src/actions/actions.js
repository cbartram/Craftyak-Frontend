/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import {get, post, put} from '../util';
import {ADD_TO_CART} from "../constants";
import {REMOVE_FROM_CART} from "../constants";
import {UPDATE_SORT_OPTIONS} from "../constants";
import {FILTER_PRODUCTS} from "../constants";
import {REMOVE_ALL_FROM_CART} from "../constants";
import {UPDATE_QUANTITY} from "../constants";
import {OAUTH_ENDPOINT} from "../constants";
import {CLIENT_ID} from "../constants";
import {CLIENT_SECRET} from "../constants";
import {OAUTH_TOKEN_SUCCESS} from "../constants";
import {getRequestUrl} from "../constants";
import {CREATE_PAYMENT_FAILURE} from "../constants";

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const getProducts = () => async (dispatch, getState) => {
    await get(constants.GET_ALL_PRODUCTS_ENDPOINT, constants.GET_PRODUCTS_REQUEST, constants.GET_PRODUCTS_SUCCESS, constants.GET_PRODUCTS_FAILURE, dispatch, getState, false);
};

/**
 * Retrieves an oauth token from Auth0 using the backend Spring
 * server as a proxy
 * @returns {Function}
 */
export const getOAuthToken = () => async (dispatch) => {
    const response = await (await fetch(getRequestUrl(OAUTH_ENDPOINT), {
        method: 'GET',
        headers: {
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        }
    })).json();
   dispatch({ type: OAUTH_TOKEN_SUCCESS, payload: response });
};

/**
 * Creates a new stripe payment and session
 * @param payload Object the products that are being created
 * @returns {Function}
 */
export const createStripeSession = (payload) => async (dispatch, getState) => {
  await post(payload, constants.CREATE_PAYMENT_ENDPOINT, constants.CREATE_PAYMENT_REQUEST, constants.CREATE_PAYMENT_SUCCESS, constants.CREATE_PAYMENT_FAILURE, dispatch, getState);
};

/**
 * Dispatches a set of actions to create
 * a new address in the database and compute shipping and tax calculations
 * for the parcels
 * @param payload Object address to create (city, state, zip etc...)
 * @returns {Function}
 */
export const createAddress = (payload) => async (dispatch, getState) => {
    await post(payload, constants.PERSIST_ADDRESS_ENDPOINT, constants.CREATE_ADDRESS_REQUEST, constants.CREATE_ADDRESS_SUCCESS, constants.CREATE_ADDRESS_FAILURE, dispatch, getState)
};


/**
 * Retrieves all active orders that have not yet been fulfilled but payment has been
 * made for Erika to ship out!
 * @returns {Function}
 */
export const getOrders = () => async (dispatch, getState) => {
  await get(constants.GET_ORDERS_ENDPOIMT, constants.ADMIN_GET_ORDERS_REQUEST, constants.ADMIN_GET_ORDERS_SUCCESS, constants.GET_PRODUCTS_FAILURE, dispatch, getState);
};


/**
 * Updates an order status given the orders id and the status to update the
 * order too. Payload looks like { status: "some_new_status" }
 * @returns {Function}
 */
export const updateOrders = (payload, id) => async (dispatch, getState) => {
    await put(payload, constants.UPDATE_ORDERS_ENDPOINT + id, constants.ADMIN_UPDATE_ORDER_REQUEST, constants.ADMIN_UPDATE_ORDER_SUCCESS, constants.ADMIN_UPDATE_ORDER_FAILURE, dispatch, getState)
};

/**
 * Dispatches a stripe payment error
 * @param message
 * @returns {{payload: *, type: *}}
 */
export const stripeError = (message) => ({
    type: CREATE_PAYMENT_FAILURE,
    payload: message
});

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
