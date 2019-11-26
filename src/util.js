/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import React from 'react';
import isNil from 'lodash/isNil';
import takeRight from 'lodash/takeRight';
import {getRequestUrl} from "./constants";
let currentStore;
// Object holding action types as keys and promises as values which need resolutions
const typeResolvers = {};

/**
 * Custom Redux middleware which wraps the action being dispatched
 * in a promise which can be resolved or rejected before continuing
 * @param store Object redux store
 * @returns {function(*): Function}
 */
export const dispatchProcessMiddleware = (store) => {
    currentStore = store;
    return next => (action) => {
        const resolvers = typeResolvers[action.type];
        if (resolvers && resolvers.length > 0) {
            resolvers.forEach(resolve => resolve());
        }
        next(action);
    };
};

/**
 * Unique Dispatch which can use promises to wait for async dispatch
 * actions to complete successfully or fail gracefully.
 * @param requestAction Function the action being dispatched (called as a function)
 * @param successActionType String the action type if the async action was successful
 * @param failureActionType String the action type if the async action was un-successful
 * @returns {Promise<any>}
 */
export const dispatchProcess = (requestAction, successActionType, failureActionType = undefined) => {
    if (!currentStore) {
        throw new Error('dispatchProcess middleware must be registered');
    }

    if (!successActionType) {
        throw new Error('At least one action to resolve process is required');
    }


    const promise = new Promise((resolve, reject) => {
        typeResolvers[successActionType] = typeResolvers[successActionType] || [];
        typeResolvers[successActionType].push(resolve);
        if (failureActionType) {
            typeResolvers[failureActionType] = typeResolvers[failureActionType] || [];
            typeResolvers[failureActionType].push(reject);
        }
    });

    currentStore.dispatch(requestAction);

    return promise;
};

/**
 * Highlights the search query text that is found within an element to show users
 * exactly how their search found the results
 * @param query String the the query text the user has typed in
 * @param element String the full text to search for the query within. i.e. if the query is "ank" the full text might be "Banker"
 * and "ank" would be highlighted in the word "Banker"
 * @param green Boolean true if the highlighted color should be green and false otherwise (it will default to blue)
 */
export const matchSearchQuery = (query, element, green = false) => {
    if(query.length === 0) return <p className="mb-1 text-truncate muted">{ element }</p>;
    const idx = element.toUpperCase().search(query.toUpperCase());

    // The query appears within the element
    if(idx > -1) {
        const firstPart = element.substring(0, idx);
        const highlightedPart = element.substring(idx, idx + query.length);
        const endPart = element.substring(idx + query.length, element.length);
        return <p className="mb-1 text-truncate muted">{firstPart}<span
            className={green ? 'search-highlight-green' : 'search-highlight'}>{highlightedPart}</span>{endPart}</p>
    }

    // The query is not found simply return the full element
    return <p className="mb-1 text-truncate muted">{element}</p>
};

/**
 * Makes a generic GET request to the API to retrieve, insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param path
 * @param requestType
 * @param successType
 * @param failureType
 * @param dispatch
 * @param getState
 * @param debug
 * @returns {Promise<unknown>}
 */
export const get = async (path, requestType, successType, failureType, dispatch, getState, debug = false) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: {}
    });

    try {
        const params = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getState().auth.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        const response = await fetch(getRequestUrl(path), params);
        const body = await (response).json();
        debug && console.log('[DEBUG] GET Response: ', body);

        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status <= 210) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: body,
                });

                resolve(response);
            } else if (response.status > 210 || typeof response.status === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(body)}`}
                });

                reject(response);
            }
        });
    } catch(err) {
        console.log('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};

/**
 * Makes a generic POST request to the API to retrieve, insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param body Object the body to be included in the post request
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @param getState function returns the current state of the application as an object from the redux store
 * @param debug Boolean true if we should print the http response and false otherwise. Defaults to false
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const post = async (body, path, requestType, successType, failureType, dispatch, getState, debug = false) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: body // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getState().auth.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        };

        const response = await fetch(getRequestUrl(path), params);
        const responseBody = await (response).json();
        debug && console.log('[DEBUG] Post Response: ', responseBody);

        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status <= 210) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: responseBody,
                });

                resolve(responseBody);
            } else if (response.statusCode > 210 || typeof response.statusCode === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(responseBody)}`}
                });

                reject(responseBody);
            }
        });
    } catch(err) {
        console.log('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};

/**
 * Makes a generic PUT request to the API to retrieve, insert, or update
 * data and dispatches actions to redux to update application state based on the response.
 * @param body Object the body to be included in the post request
 * @param path String the API path to POST to. This should begin with a /
 * @param requestType String the redux dispatch type for making the API request
 * @param successType String the redux dispatch type when the request is successful
 * @param failureType String the redux dispatch type when the request has failed.
 * @param dispatch Function redux dispatch function
 * @param getState function returns the current state of the application as an object from the redux store
 * @param debug Boolean true if we should print the http response and false otherwise. Defaults to false
 * @returns {Promise<*|Promise<any>|undefined>}
 */
export const put = async (body, path, requestType, successType, failureType, dispatch, getState, debug = false) => {
    //If we don't need redux for the action we can just skip the dispatch by setting the actions to null
    let doDispatch = true;
    if (isNil(requestType) || isNil(successType) || isNil(failureType)) doDispatch = false;

    doDispatch &&
    dispatch({
        type: requestType,
        payload: body // Sets isFetching to true (useful for unit testing redux)
    });

    try {
        const params = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getState().auth.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        };

        const response = await fetch(getRequestUrl(path), params);
        const responseBody = await (response).json();
        debug && console.log('[DEBUG] PUT Response: ', responseBody);

        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status <= 210) {
                doDispatch &&
                dispatch({
                    type: successType,
                    payload: responseBody,
                });

                resolve(responseBody);
            } else if (response.statusCode > 210 || typeof response.statusCode === 'undefined') {
                // An error occurred
                doDispatch &&
                dispatch({
                    type: failureType,
                    payload: { message: `There was an error retrieving data from the API: ${JSON.stringify(responseBody)}`}
                });

                reject(responseBody);
            }
        });
    } catch(err) {
        console.log('[ERROR] Error receiving response from API', err);
        doDispatch &&
        dispatch({
            type: failureType,
            payload: { message: err.message }
        });
    }
};


/**
 * Formats a word by capitalizing the first
 * letter and replacing underscores with spaces
 * @param word String words
 * @returns {string}
 */
export const format = (word) => {
    return word.split("_").map(wordPart => wordPart.charAt(0).toUpperCase() + wordPart.slice(1, wordPart.length)).join(' ');
};


/**
 * Takes a standard list and formats it so that it
 * will work in Semantic ui Dropdowns and Select components as
 * a set of options
 * @param list List of elements
 * @returns {*}
 */
export const optionify = (list) => {
    return list.map(val => ({ key: val, value: val, text: val }));
};

/**
 * Given an attribute name like size or color returns
 * a list of possible values for that attribute.
 * Size may return ["small", "medium", "large"]
 */
export const getAttributeValues = (attributeName) => {
    switch (attributeName.toUpperCase()) {
        case "SIZE":
            return {
                mapsTo: 'size',
                options: optionify(['XS', 'Small', 'Medium', 'Large', 'XL', 'XXL'])
            };
        case "COLOR":
            return {
                mapsTo: 'color',
                options: ["#000000", "#ffffff"]
            };
        case "STICKER_COLOR":
            return {
                mapsTo: 'sticker_color',
                options: ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"],
            };
        case "STICKER_TYPE":
            return {
                mapsTo: 'sticker_type',
                options: optionify(['Heat Transfer Vinyl', 'Standard Vinyl'])
            };
        case "MUG_MATERIAL":
            return {
                mapsTo: 'MUG_MATERIAL',
                options: optionify(['Ceramic', 'Matte', 'Porcelain'])
            };
        case "STYLE":
            return {
                mapsTo: 'style',
                options: [{
                    key: 'T-Shirt',
                    value: 't-shirt',
                    text: 'T-Shirt',
                }, {
                    key: 'Tank Top',
                    value: 'tank',
                    text: 'Tank Top'
                }]
            };
        case "MATERIAL_SHIRT":
            return {
                mapsTo: 'material_shirt',
                options: optionify(['Cotton', 'Dryfit', 'Nylon', 'Polyester'])
            };
        default:
            return {
                mapsTo: 'none',
                options: []
            }
    }
};

/**
 * Formats a price from cents ¢ to a
 * dollar cents string with the $
 * @param amount Int price in pennies
 */
export const formatPrice = (amount) => {
    return (amount / 100).toFixed(2);
};

/**
 * Given a set of attribute names and a value for
 * each name this function determines the SKU for the permutation.
 * i.e name = [color, size] and value = [white, large] => sku_...
 * Note attribute names and values must be arrays of the same size
 */
export const getSKU = function(skuList, attributeNames, attributeValues) {
    if(attributeNames.length !== attributeValues.length) {
        throw new Error("Attribute names and values must be of the same length.");
    }

    // Filter out the quantity attribute name and value as quantity is never filterable on an SKU
    attributeNames = attributeNames.filter(i => i !== 'quantity');
    attributeValues = attributeValues.filter(i => typeof i !== 'number');

    if(skuList.length === 1) {
        return skuList[0];
    } else if(skuList.length === 0) {
        // There are no combinations of sku's that match the attribute values
        return null;
    } else if(attributeValues.length === 0 || attributeNames.length === 0) {
        // There are multiple SKU's that fit the search criteria but no more attributes to filter on simply
        // return the best fit i.e given ['size' => 'small'] may product [{}, {}, {}, {}] we have to just choose one
        return skuList[0];
    }
    // This contains all sku's with attribute X in array [X, Y, Z] on the first iteration
    const filter = skuList.filter(sku => sku.attributes[attributeNames[0]] === attributeValues[0]);
    return getSKU(filter, takeRight(attributeNames, attributeNames.length - 1), takeRight(attributeValues, attributeValues.length - 1));
};
