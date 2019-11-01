import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE, UPDATE_SORT_OPTIONS, FILTER_PRODUCTS
} from '../constants';

const DEFAULT_STATE = {
    items: [],
    originalItems: [],
    isFetching: false,
    sort: { formattedText: 'Product Type', value: 'PRODUCT_TYPE' },
    filter: 'NONE'
};


/**
 * Updates state in redux to describe when a product changes
 * @param state
 * @param action
 * @returns {{isFetching: boolean, error: null}|{}}
 */
export default (state = { ...DEFAULT_STATE }, action) => {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
            return {
                ...state,
                error: null,
                isFetching: true,
            };
        case GET_PRODUCTS_SUCCESS:
            console.log(action.payload);
            return {
                ...state,
                isFetching: false,
                items: [...action.payload.data.map(i => ({ ...i, quantity: 1 }))],
                originalItems: action.payload, // Holds a full list of original set of items for filtering later
            };
        case GET_PRODUCTS_FAILURE:
            return {
                ...state,
                error: action.payload,
                isFetching: true,
                items: [],
                originalItems: [],
            };
        case FILTER_PRODUCTS:
            const falsyAttributes = Object.keys(action.payload).reduce((o, key) => {
                action.payload[key] !== true && (o[key] = action.payload[key]);
                return o;
            }, {});

            // If all checkbox are un-selected show all the items we have rather than
            // showing none of the items since everything is technically "filtered" out
            if(Object.keys(action.payload).length === Object.keys(falsyAttributes).length) {
                return {
                    ...state,
                    items: [...state.originalItems],
                }
            }

            const d = state.originalItems.filter(({ category }) => {
                const keys = Object.keys(falsyAttributes);
                if(category.mug && keys.includes("mug")) {
                    return false;
                } else if(category.sticker && keys.includes("sticker")) {
                    return false;
                } else if(category.shirt && keys.includes("shirt")) {
                    return false;
                } else if(category.cup && keys.includes("cup")) {
                    return false
                }
                return true;
            });

            return {
                ...state,
                items: [...d],
            };
        case UPDATE_SORT_OPTIONS:
            return {
                ...state,
                sort: {
                    formattedText: getFormattedSortText(action.payload),
                    value: action.payload
                },
                items: [...state.items].sort(getSortComparator(action.payload))
            };
        default:
            return {
                ...state
            }
    }
}

/**
 * Returns the proper sort comparator function given
 * the sort enum value
 * @param value String sort enum value
 */
const getSortComparator = (value) => {
    switch(value) {
        case 'PRODUCT_TYPE':
            return (a, b) => b.category.mug - a.category.mug ||
                b.category.shirt - a.category.shirt||
                b.category.cup - a.category.cup ||
                b.category.sticker - a.category.sticker;
        case 'NEWEST':
            return (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
        case 'PRICE_HL':
            return (a, b) => b.price - a.price;
        case 'PRICE_LH':
            return (a, b) => a.price - b.price;
    }
};

/**
 * Formats a sort enum to a pretty formatted String
 * @param value String the sort enum
 * @returns {string}
 */
const getFormattedSortText = (value) => {
    switch(value) {
        case 'PRODUCT_TYPE':
            return 'Product Type';
        case 'NEWEST':
            return 'Newest';
        case 'PRICE_HL':
            return 'Price: High to Low';
        case 'PRICE_LH':
            return 'Price: Low to High';
    }
};
