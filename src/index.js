import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import {Elements, StripeProvider} from 'react-stripe-elements';
import * as Apollo from 'apollo-boost';
import {setContext} from "apollo-link-context";
import {ApolloClient} from 'apollo-client'
import {ApolloProvider} from "react-apollo";
import rootReducer from './reducers/rootReducer';
import Router from './components/Router/Router'
import { dispatchProcessMiddleware, dispatchProcess } from './util';
import {
    DEV_URL,
    IS_PROD,
    PROD_URL,
    INITIAL_STATE,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    OAUTH_TOKEN_SUCCESS,
    OAUTH_TOKEN_FAILURE
} from './constants'
import * as serviceWorker from './serviceWorker';
import {getOAuthToken, getProducts} from "./actions/actions";
import 'semantic-ui-css/semantic.min.css'
import './index.css';

// Setup Redux middleware and store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, INITIAL_STATE, composeEnhancers(
    applyMiddleware(thunk, dispatchProcessMiddleware)
));

// Adds custom headers to graphQL requests
const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            Authorization: 'user-auth',
            'x-api-key': 'foo',
        },
    }
});

// Setup GraphQL Client
const client = new ApolloClient({
    link: authLink.concat(Apollo.HttpLink({uri: IS_PROD ? `${PROD_URL}/graphql` : `${DEV_URL}/graphql`})),
    cache: new Apollo.InMemoryCache()
});

/**
 * Renders the App to the DOM
 * @returns {Promise<void>}
 */
const render = async () => {
    try {
        await dispatchProcess(getOAuthToken(), OAUTH_TOKEN_SUCCESS, OAUTH_TOKEN_FAILURE);
        await dispatchProcess(getProducts(), GET_PRODUCTS_SUCCESS, GET_PRODUCTS_FAILURE);
        ReactDOM.render(
            <ApolloProvider client={client}>
                <Provider store={store}>
                    <StripeProvider apiKey="pk_test_AIs6RYV3qrxG6baDpohxn1L7">
                        <Elements>
                            <Router/>
                        </Elements>
                    </StripeProvider>
                </Provider>
            </ApolloProvider>, document.getElementById('root'));
    } catch(error) {
        console.log("[Error] There was an issue loading the App: ", error);
        // TODO Render the error page
    }
};

render().then(() => console.log('App Loaded'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
