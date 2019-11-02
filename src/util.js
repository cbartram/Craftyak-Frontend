/**
 * Util.js
 * This file houses a collection of helper functions used in multiple places throughout the application
 * @author cbartram
 */
import React from 'react';
import isNil from 'lodash/isNil';
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
                Authorization: 'foo',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': 'api-key',
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
                Authorization: 'foo',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': 'api-key',
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
 * Formats a word by capitalizing the first
 * letter and replacing underscores with spaces
 * @param word String words
 * @returns {string}
 */
export const format = (word) => {
    word = word.split("_").join(" ");
    return word.charAt(0).toUpperCase() + word.slice(1, word.length);
};

/**
 * Given an attribute name like size or color returns
 * a list of possible values for that attribute.
 * Size may return ["small", "medium", "large"]
 */
export const getAttributeValues = (attributeName) => {
    const upperAttributeName = attributeName.toUpperCase();
    switch (upperAttributeName) {
        // TODO no need to map these im just lazy they should all return objects usable by a <Select /> component
        case "SIZE":
            return ['XS', 'Small', 'Medium', 'Large', 'XL', 'XXL'].map(i => ({ key:i , value: i, text: i}));
        case "COLOR":
            return ['Red', 'Green', 'Blue', 'Orange', 'Yellow', 'White', 'Black'].map(i => ({ key:i , value: i, text: i})); // TODO map these to hex colors
        case "MATERIAL_MUG":
            return ['Ceramic', 'Matte', 'Porcelean'].map(i => ({ key:i , value: i, text: i}));
        case "MATERIAL_SHIRT":
            return ['Dryfit', 'Cotton', 'Nylon', 'Polyester'].map(i => ({ key:i , value: i, text: i}));
        default:
            return []
    }
};

/**
 * Given a set of attribute names and a value for
 * each name this function determines the SKU for the permutation.
 * i.e name = [color, size] and value = [white, large] => sku_...
 */
export const getSKU = (attributeNames, attributeValues) => {

};
