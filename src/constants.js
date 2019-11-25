/**
 * This file defines constants used throughout the frontend portion of the application.
 * Constants as the name suggests are constant and never change regardless of state changes.
 * @type {{}}
 */
import React from 'react';
import { Button } from "semantic-ui-react";

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
export const CREATE_ORDER_ENDPOINT = '/api/v1/orders/create'; // Checkout endpoint
export const CREATE_PAYMENT_ENDPOINT = '/api/v1/payments/create';
export const GET_SESSION_ENDPOINT = '/api/v1/payments/session/';
export const PERSIST_ADDRESS_ENDPOINT = '/api/v1/address/create';
export const GET_ORDERS_ENDPOIMT = '/api/v1/orders/status/awaiting_payment';
export const OAUTH_ENDPOINT = '/oauth/token';

// Prod Params
export const PROD_URL = 'https://crafty-yak.herokuapp.com';
// Dev Params
export const DEV_URL = 'http://localhost:8080';

// Configuration Params
export const AUTH0_DOMAIN = 'craftyyak.auth0.com';
export const AUTH0_CLIENT_ID = 'U5h0nsMOhmYafW3pTtaGLEshyXAg3ZN5';
export const STRIPE_TEST_KEY = 'pk_test_CQlUaXE10kegi6hyAZkrZ8eW00t56aaJrN';
export const STRIPE_LIVE_KEY = 'pk_live_aL4kCEdVxfcdxPZIqtQpsVew00SLgFsg4w';
export const CLIENT_ID = 'CEdVxfcdxPZIqt1HISBTynP00i2TedzRl';
export const CLIENT_SECRET = 'Vew00SLgFsg4w14Dv22UxPZIqt1dVxfcd';

// Redux Action/Reducer Constants
export const GET_PRODUCTS_REQUEST = 'GET_PRODUCTS_REQUEST';
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILURE = 'GET_PRODUCTS_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const CREATE_PAYMENT_REQUEST = 'CREATE_PAYMENT_REQUEST';
export const CREATE_PAYMENT_SUCCESS = 'CREATE_PAYMENT_SUCCESS';
export const CREATE_PAYMENT_FAILURE = 'CREATE_PAYMENT_FAILURE';
export const CREATE_ADDRESS_REQUEST = 'CREATE_ADDRESS_REQUEST';
export const CREATE_ADDRESS_FAILURE = 'CREATE_ADDRESS_FAILURE';
export const CREATE_ADDRESS_SUCCESS = 'CREATE_ADDRESS_SUCCESS';
export const REQUEST_OAUTH_TOKEN = 'REQUEST_OAUTH_TOKEN';
export const OAUTH_TOKEN_FAILURE = 'OAUTH_TOKEN_FAILURE';
export const OAUTH_TOKEN_SUCCESS = 'OAUTH_TOKEN_SUCCESS';
export const ADD_TO_CART = 'ADD_TO_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const REMOVE_ALL_FROM_CART = 'REMOVE_ALL_FROM_CART';
export const UPDATE_SORT_OPTIONS = 'UPDATE_SORT_OPTIONS';
export const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
export const ADMIN_GET_ORDERS_REQUEST = 'ADMIN_GET_ORDERS_REQUEST';
export const ADMIN_GET_ORDERS_FAILURE = 'ADMIN_GET_ORDERS_FAILURE';
export const ADMIN_GET_ORDERS_SUCCESS = 'ADMIN_GET_ORDERS_SUCCESS';

// React Table
export const SUB_TABLE_COLUMNS = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'Quantity',
        accessor: 'quantity',
    }, {
        Header: 'Name',
        accessor: 'name'
    }];
