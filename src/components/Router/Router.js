import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import App from '../../App';
import NotFound from '../../pages/NotFound/NotFound';
import Checkout from "../../pages/Checkout/Checkout";
import ProductDetail from "../../pages/ProductDetail/ProductDetail";
import CheckoutSuccess from "../../pages/CheckoutSuccess/CheckoutSuccess";

const mapStateToProps = state => ({
    auth: state.auth,
});

/**
 * This Component handles the routes which are displayed within index.js
 */
class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/product/:slug" component={ProductDetail} />
                    <Route exact path="/checkout" component={Checkout} />
                    <Route path="/checkout/success" component={CheckoutSuccess} />
                    {/* Todo in the future this should probably be its own cancel page notifying the user they were not charged*/}
                    <Route path="/checkout/cancel" component={App} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);
