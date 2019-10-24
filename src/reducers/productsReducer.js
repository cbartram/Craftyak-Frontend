import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE
} from '../constants';


/**
 * Updates state in redux to describe when a product changes
 * @param state
 * @param action
 * @returns {{isFetching: boolean, error: null}|{}}
 */
export default (state = { items: [], isFetching: false }, action) => {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.payload
            };
        case GET_PRODUCTS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isFetching: true,
                items: []
            };
        default:
            return {
                ...state
            }
    }
}
