import {
    ADD_TO_CART,
    CREATE_ORDER_FAILURE,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    REMOVE_ALL_FROM_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY
} from '../constants';
import groupBy from 'lodash/groupBy';

/**
 * Updates state in redux to describe when a users shopping cart changes
 * @param state
 * @param action
 * @returns {{isFetching: boolean, error: null}|{}}
 */
export default (state = { items: [], isFetching: false, subtotal: 0, total: 0 }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            // First group the cart items by their name i.e { itemOne: [{...}, {...}], itemTwo: [{...}] }
            const items = groupBy([...state.items, { ...action.payload.sku, quantity: action.payload.quantity }], 'name');
            const updatedQuantity = [];

            // For each "set" of products i.e 3 mugs, 2 cups, 9 shirts
            Object.keys(items).forEach(key => {

                // Reduce them to one object incrementing the quantity value for each item i.e 3 mugs becomes 1 object with quantity: 3
                const reduced = items[key].reduce((prev, curr) => ({ ...curr, quantity: prev.quantity + curr.quantity }));

                // Add that to a set of unique cart items with a specific quantity set
                updatedQuantity.push(reduced)
            });
            return {
                ...state,
                items: [...updatedQuantity]
            };
        case REMOVE_FROM_CART:
            const data = state.items.map(item => {
                // This is not the item you are looking for (yes this was a reference to star wars)
                if(item.id !== action.payload) {
                    return item;
                } else {
                    // Try to subtract 1 from the quantity
                    if(item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        // The quantity of the item is only 1 just remove it
                        return null;
                    }
                }
            }).filter(Boolean);

            return {
                ...state,
                items: [...data]
            };
        case REMOVE_ALL_FROM_CART:
            return {
                ...state,
                items: [...state.items.filter(product => product.id !== action.payload)]
            };
        case UPDATE_QUANTITY:
            const updatedItems = state.items.map(item => {
                if(item.id === action.payload.id) {
                    return { ...item, quantity: action.payload.value}
                }
                return item;
            });
            return {
                ...state,
                items: [...updatedItems]
            };
        case CREATE_ORDER_REQUEST:
            console.log("Creating order request...");
            return {
                ...state,
                isFetching: true,
            };
        case CREATE_ORDER_SUCCESS: {
            console.log("Success!", action.payload);
            return {
                ...state,
            }
        }
        case CREATE_ORDER_FAILURE: {
            console.log("Failure: ", action.payload);
            return {
                ...state,
                isFetching: false,
                error: action.payload
            }
        }
        default:
            return {
                ...state
            }
    }
}
