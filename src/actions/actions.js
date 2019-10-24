/**
 * This file defines actions which trigger switch statements in the reducer
 */
import * as constants from '../constants';
import { get } from '../util';

/**
 * Sends a user's current video information (such as duration completed, started watching etc.) to
 * the backend for storage. This also updates redux with the latest values.
 * @returns {Function}
 */
export const getProducts = (payload) => async (dispatch, getState) => {
    await get(constants.GET_ALL_PRODUCTS_ENDPOINT, constants.GET_PRODUCTS_REQUEST, constants.GET_PRODUCTS_SUCCESS, constants.GET_PRODUCTS_FAILURE, dispatch, getState, true);
};
