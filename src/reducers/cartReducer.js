import {
    ADD_TO_CART,
    REMOVE_FROM_CART
} from '../constants';
import groupBy from 'lodash/groupBy';
import _ from 'lodash';


/**
 * Updates state in redux to describe when a users shopping cart changes
 * @param state
 * @param action
 * @returns {{isFetching: boolean, error: null}|{}}
 */
export default (state = { items: [] }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            // First group the cart items by their name i.e { itemOne: [{...}, {...}], itemTwo: [{...}] }
            const items = groupBy([...state.items, action.payload], 'name');
            const updatedQuantity = [];

            // For each "set" of products i.e 3 mugs, 2 cups, 9 shirts
            Object.keys(items).forEach(key => {

                // Reduce them to one object incrementing the quantity value for each item i.e 3 mugs becomes 1 object with quantity: 3
                const reduced = items[key].reduce((prev, curr) => ({ ...curr, quantity: prev.quantity + 1 }));

                // Add that to a set of unique cart items with a specific quantity set
                updatedQuantity.push(reduced)
            });
            return {
                ...state,
                items: [...updatedQuantity]
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
