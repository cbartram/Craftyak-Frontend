/**
 * This file defines constants used throughout the frontend portion of the application.
 * Constants as the name suggests are constant and never change regardless of state changes.
 * @type {{}}
 */
export const INITIAL_STATE = {};

/**
 * Helper function which determines the correct API to hit (prod,dev) and the correct region to use.
 * Note: this defaults to the east region if the REACT_APP_API_REGION is not declared.
 * @param endpointURI String URI of the endpoint requested starting with '/' and ending without a '/'
 * i.e. (/users/find)
 * @returns {string}
 */
export const getRequestUrl = (endpointURI) => {
    let url = '';

    // Attempt to use prod
    if(IS_PROD)
        url = `${PROD_URL}${endpointURI}`;
    else
        url = `${DEV_URL}${endpointURI}`;

    return url;
};

/**
 * Helper variable to determine if the App is in the production environment. This decides which API call to make.
 * @type {boolean} True if the application is running in prod and false otherwise.
 */
export const IS_PROD = window.location.hostname !== 'localhost' || process.env.REACT_APP_NODE_ENV === 'production';

//Endpoints
export const GET_ALL_PRODUCTS_ENDPOINT = '/api/v1/products/';

// Prod Params
export const PROD_URL = 'https://2147bwmah5.execute-api.us-east-1.amazonaws.com/prod';
// Dev Params
export const DEV_URL = 'http://localhost:8080';

// Configuration Params
export const API_KEY = 'pgS8gGvkv53xFg4BdgECn38C4CDNZXKj8EqFtQdW';
export const PROD_API_KEY = 'mNer7Typlc9npqrkThXZ08xAIWoBXLyG2NEfHDd2';

// Redux Action/Reducer Constants
export const GET_PRODUCTS_REQUEST = 'GET_PRODUCTS_REQUEST';
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILURE = 'GET_PRODUCTS_FAILURE';
