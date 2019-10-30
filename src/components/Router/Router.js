import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import App from '../../App';
import NotFound from '../../pages/NotFound/NotFound';
import Checkout from "../../pages/Checkout/Checkout";

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
                    <Route path="/checkout" component={Checkout} />
                    {/* Catch All unmatched paths with a 404 */}
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default connect(mapStateToProps)(Router);
