import React, { Component } from "react";
import { connect } from 'react-redux';
import {
    Header,
    Button,
    Card, Icon
} from "semantic-ui-react";
import isNil from 'lodash/isNil';
import { StepOne } from './stepper/StepOne';
import { Link } from 'react-router-dom';
import withContainer from "../../components/withContainer";
import './Checkout.css';
import { removeAllFromCart, updateQuantity} from "../../actions/actions";
import {CREATE_PAYMENT_ENDPOINT, PERSIST_ADDRESS_ENDPOINT, getRequestUrl} from "../../constants";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepTwo } from "./stepper/StepTwo";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
const stripe = window.Stripe('pk_test_CQlUaXE10kegi6hyAZkrZ8eW00t56aaJrN');

const mapStateToProps = (state) => ({
    cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
    removeAllFromCart: (payload) => dispatch(removeAllFromCart(payload)),
    updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
});

/**
 * A functional component which is shown when the rout returns a 404
 * @returns {*}
 */
class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sessionId: null,
            activeStep: 0,
            loading: false,
            showErrorMessage: false,
            errorMessage: '',
            steps: ['Review', 'Shipping', 'Checkout'],
            data: {}, // Address data from step two
            shippingAddress: null, // The id of the address to ship to stored in the db
            addressErrors: {
                city: false,
                firstName: false,
                lastName: false,
                state: false,
                zip: false,
                street: false,
            },
        };
    }

    /**
     * Stores the users shipping address in the database
     * @returns {Promise<null|any>}
     */
    persistAddress() {
        this.setState({ loading: true }, async () => {
            try {
                const params = {
                    method: 'POST',
                    headers: {
                        Authorization: 'foo',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'x-api-key': 'api-key',
                    },
                    body: JSON.stringify({ ...this.state.data }),
                };

                const response = await fetch(getRequestUrl(PERSIST_ADDRESS_ENDPOINT), params);
                const data = await response.json();
                this.setState({ loading: false, shippingAddress: data.id });
            } catch(err) {
                console.log("Failed to persist address something went wrong in the network call: ", err);
                this.setState({
                    loading: false,
                    showErrorMessage: true,
                    errorMessage: 'There was an issue saving your address in our database. Please refresh the page and try again.'
                });
                return null;
            }
        });
    }

    /**
     * Validates that a shipping address contains the proper information
     * @param data Object shipping address data
     * @returns {{zip: boolean, firstName: boolean, lastName: boolean, city: boolean, street: boolean, state: boolean}}
     */
    validateAddress(data) {
        return {
            city: isNil(data.city) || data.city.length < 1,
            state: isNil(data.state) || data.state.length < 1,
            zip: !/^\d{5}(?:[-\s]\d{4})?$/.test(data.zip),
            street: isNil(data.street) || data.street.length < 1,
            firstName: isNil(data.firstName) || data.firstName.length < 1,
            lastName: isNil(data.lastName) || data.lastName.length < 1
        }
    }


    /**
     * Increases the stepper's currently
     * active step
     */
    handleNext() {
        const { activeStep, data } = this.state;

        // Users are submitting the form for their address validate it
        if(activeStep === 1) {
            const addressErrors = this.validateAddress(data);
            // True if there are any errors in the map
            if(Object.values(addressErrors).filter(Boolean).length > 0) {
                console.log('Errors found in address: ', addressErrors);
                this.setState({ addressErrors });
                return;
            } else {
                this.persistAddress();
            }
        }

        if(activeStep === 2) {
            console.log("Creating stripe session");
            this.createStripeSession();
            return;
        }

        this.setState( (prevState) => ({ activeStep: prevState.activeStep + 1 }));
    };

    /**
     * Decrements the steppers active step
     */
    handleBack() {
        this.setState((prevState) => ({ activeStep: prevState.activeStep - 1 }));
    };

    /**
     * Renders an empty cart page if there
     * are no items in the users cart.
     * @returns {*}
     */
    renderEmptyCart() {
        return (
            <div className="row page-bg-gray">
                <div className="col-md-4 ml-auto mr-auto">
                    <Header as="h1" className="empty-cart-header">Your cart is empty</Header>
                    <div className="d-flex flex-column justify-content-center">
                        <Button as={Link} to="/" primary>
                            Browse Products
                        </Button>
                    </div>
                    <div className="empty-cart-logo" />
                </div>
            </div>
        )
    }

    /**
     * Creates a new Stripe session by making an Http POST
     * to the server to interact with stripe.
     * @returns {Promise<void>}
     */
    createStripeSession() {
        this.setState({ loading: true }, async () => {
            try {
                const params = {
                    method: 'POST',
                    headers: {
                        Authorization: 'foo',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'x-api-key': 'api-key',
                    },
                    body: JSON.stringify(this.props.cart.items),
                };

                const response = await fetch(getRequestUrl(CREATE_PAYMENT_ENDPOINT) + '/' + this.state.shippingAddress, params);
                const { session_id } = await(response).json();
                const {error} = await stripe.redirectToCheckout({
                    sessionId: session_id,
                });

                if(error) {
                    console.log("Error redirecting user to stripe checkout page: ", error);
                    this.setState({ loading: false, showErrorMessage: true, errorMessage: 'Something went wrong redirecting you to the checkout page. Refresh the page and try again.'})
                } else {
                    this.setState({loading: false});
                }
            } catch(err) {
                this.setState({ loading: false, showErrorMessage: true, errorMessage: 'Something went wrong creating a new checkout session for you. Please refresh the page and try again' });
                console.log("[ERROR] Error creating new stripe session: ", err);
            }
        });
    }

    /**
     * Handles updating local state when form fields are entered
     */
    onFieldUpdate(value, field) {
        this.setState((prevState) => ({
            data: {
                ...prevState.data,
                [field]: value,
            }
        }))
    }

    renderStep(step) {
        switch(step) {
            case 0:
                return (
                    <StepOne
                        header="Your Cart"
                        items={this.props.cart.items}
                        onUpdateQuantity={(uuid, value) => this.props.updateQuantity(uuid, value)}
                        onRemove={(uuid) => this.props.removeAllFromCart(uuid)}
                    />
                );
            case 1:
                return <StepTwo
                        onFieldUpdate={(value, field) => this.onFieldUpdate(value, field)}
                        errors={this.state.addressErrors}
                    />;
            case 2:
                return <StepOne
                             header="Review and Checkout"
                             items={this.props.cart.items}
                             onUpdateQuantity={(uuid, value) => this.props.updateQuantity(uuid, value)}
                             onRemove={(uuid) => this.props.removeAllFromCart(uuid)}
                        />;
            default:
                return <h3>Unknown</h3>
        }
    }

    render() {
        if(this.props.cart.items.length === 0)
            return this.renderEmptyCart();
        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={this.state.showErrorMessage}
                    autoHideDuration={6000}
                    onClose={() => this.setState({ showErrorMessage: false, errorMessage: '' })}
                >
                    <SnackbarContent
                        message={
                            <span>
                     <Icon name="warning" />
                        { this.state.errorMessage }
                    </span>
                        }
                        action={<Icon name="cancel" onClick={() => this.setState({ showErrorMessage: false, errorMessage: '' })} />}
                    />
                </Snackbar>
                <div className="row page-bg-gray">
                    <div className="col-md-6 ml-auto mr-auto">
                        <Stepper activeStep={this.state.activeStep} alternativeLabel>
                            {this.state.steps.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                </div>
                <div className="row page-bg-gray">
                    <div className="col-md-5 ml-auto my-4">
                        { this.renderStep(this.state.activeStep) }
                    </div>
                    <div className="col-md-4 " style={{ marginTop: 'calc(1.5rem + 45px)', marginBottom: '1.5rem'}}>
                        <Card>
                            <Card.Content header={
                                <div className="d-flex">
                                    <span style={{ fontSize: 17 }}>Subtotal</span>
                                    <span className="ml-auto" style={{ fontSize: 17 }}>
                                        ${
                                            (this.props.cart.items.reduce((prev, curr) => ({ price: (curr.price * curr.quantity) + prev.price, }), { price: 0, quantity: 0 }).price / 100).toFixed(2)
                                        }
                                    </span>
                                </div>
                            } />
                            <Card.Content>
                                <div className="d-flex flex-column">
                                    <Button primary onClick={(e, f) => this.handleNext(e, f)} loading={this.state.loading} className="mb-2" disabled={this.state.activeStep >= this.state.steps.length}>
                                        {this.state.activeStep === this.state.steps.length - 1 ? 'Checkout' : 'Next'}
                                    </Button>
                                    <Button disabled={this.state.activeStep === 0} onClick={() => this.handleBack()}>
                                        Back
                                    </Button>
                                <span className="text-muted-small">
                                    Tax and shipping will be calculated at checkout.
                                </span>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(Checkout));
