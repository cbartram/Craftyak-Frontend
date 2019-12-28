import {
    ADMIN_GET_ORDERS_FAILURE,
    ADMIN_GET_ORDERS_REQUEST,
    ADMIN_GET_ORDERS_SUCCESS,
    ADMIN_UPDATE_ORDER_FAILURE,
    ADMIN_UPDATE_ORDER_REQUEST,
    ADMIN_UPDATE_ORDER_SUCCESS,
} from "../constants";

export default (state = {}, action) => {
    switch (action.type) {
        case ADMIN_GET_ORDERS_REQUEST:
        case ADMIN_UPDATE_ORDER_REQUEST:
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
        case ADMIN_UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                orders: [...state.orders.map(order => {
                    console.log(order.id, action.payload.id);
                    if(order.id === action.payload.id)
                        return action.payload;
                    return order;
                })],
                isFetching: false,
                error: null,
            };
        case ADMIN_UPDATE_ORDER_FAILURE:
            return {
                ...state,
                error: 'Failed to update the order with the API',
                isFetching: false,
            };
        default:
            return {
                ...state,
            }
    }
}
