import {
    ADMIN_GET_ORDERS_FAILURE,
    ADMIN_GET_ORDERS_REQUEST, ADMIN_GET_ORDERS_SUCCESS,
    OAUTH_TOKEN_FAILURE,
    OAUTH_TOKEN_SUCCESS,
    REQUEST_OAUTH_TOKEN
} from "../constants";

export default (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_ORDERS_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case ADMIN_GET_ORDERS_FAILURE:
            return {
                ...state,
                error: 'Failed to retrieve orders from the API',
                isFetching: false
            };
        case ADMIN_GET_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                isFetching: false,
                error: null,
            };
        default:
            return {
                ...state,
            }
    }
}
