/**
 * Updates state in redux to describe when a stripe session changes or is
 * instantiated
 * @param state Global redux state object
 * @param action Object the action being dispatched
 * @returns {{isFetching: boolean, error: null}|{}}
 */
import {
    CREATE_PAYMENT_FAILURE,
    CREATE_PAYMENT_REQUEST,
    CREATE_PAYMENT_SUCCESS,
    CREATE_ADDRESS_FAILURE,
    CREATE_ADDRESS_REQUEST,
    CREATE_ADDRESS_SUCCESS
} from "../constants";

export default (state = { session: null, isFetching: false, error: null, address: null }, action) => {
    switch (action.type) {
        case CREATE_PAYMENT_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case CREATE_PAYMENT_FAILURE:
            console.log("Error creating stripe checkout session: ", action.payload);
            return {
                ...state,
                isFetching: false,
                error: "There was an issue creating your checkout session. Please refresh the page and try again."
            };
        case CREATE_PAYMENT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null,
                session: {
                    ...action.payload
                }
            };
        case CREATE_ADDRESS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case CREATE_ADDRESS_FAILURE:
            return {
                ...state,
                error: "There was an issue saving your shipping address information. Please refresh the page and try again.",
                isFetching: false,
                address: null,
            };
        case CREATE_ADDRESS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null,
                address: {
                    ...action.payload
                }
            };
        default:
            return {
                ...state,
            }
    }
}
