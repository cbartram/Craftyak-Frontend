import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE, UPDATE_SORT_OPTIONS
} from '../constants';

const DEFAULT_STATE = {
    items: [],
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
            return (a, b) => a.category - b.category;
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
