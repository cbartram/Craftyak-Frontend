import {
    ADD_TO_CART,
    REMOVE_FROM_CART
} from '../constants';
import groupBy from 'lodash/groupBy';


/**
 * Updates state in redux to describe when a users shopping cart changes
 * @param state
 * @param action
 * @returns {{isFetching: boolean, error: null}|{}}
 */
export default (state = { items: [] }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const items = groupBy(state.items, 'name');
            console.log(items);
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case REMOVE_FROM_CART:
            const filteredItems = state.items.filter(item => item.uuid !== action.payload);
            return {
                ...state,
                items: [...filteredItems]
            };
        default:
            return {
                ...state
            }
    }
}
