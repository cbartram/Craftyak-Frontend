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
            let foundDup = false;
            const skus = state.items.map(item => {
                if(item.id === action.payload.sku.id) {
                    // The skus are the same simply increase the quantity
                    foundDup = true;
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                }

                return item;
            });

            if(!foundDup) {
                skus.push({ ...action.payload.sku, quantity: action.payload.quantity });
            }

            return {
                ...state,
                items: [...skus]
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
