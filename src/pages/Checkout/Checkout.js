import React, { Component } from "react";
import { connect } from 'react-redux';
import {
    Header,
    Button,
    Card, Icon
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepTwo } from "./stepper/StepTwo";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Snackbar from "@material-ui/core/Snackbar";
import isNil from 'lodash/isNil';
import { StepOne } from './stepper/StepOne';
import withContainer from "../../components/withContainer";
import {
    createAddress,
    createStripeSession,
    removeAllFromCart, stripeError,
    updateQuantity
} from "../../actions/actions";
import {
    CREATE_PAYMENT_ENDPOINT,
    PERSIST_ADDRESS_ENDPOINT,
    getRequestUrl,
    IS_PROD,
    STRIPE_LIVE_KEY,
    STRIPE_TEST_KEY
} from "../../constants";
import './Checkout.css';
const stripe = window.Stripe(STRIPE_TEST_KEY); // TODO update to IS_PROD ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY

const mapStateToProps = (state) => ({
    cart: state.cart,
    auth: state.auth,
    stripe: state.stripe,
});

const mapDispatchToProps = (dispatch) => ({
    removeAllFromCart: (payload) => dispatch(removeAllFromCart(payload)),
    updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
    createStripeSession: (payload) => dispatch(createStripeSession(payload)),
    createAddress: (payload) => dispatch(createAddress(payload))
});

/**
 * A functional component which is shown when the rout returns a 404
 * @returns {*}
 */
class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            steps: ['Review', 'Shipping', 'Checkout'],
            address: {}, // Address data from step two updated when a user types in their address details
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
     * Stores the users shipping address in the database and
     * calculates tax and shipping information with EasyPost
     * @returns {Promise<null|any>}
     */
    async persistAddress() {
        await this.props.createAddress({
            address: this.state.address,
            skus: this.props.cart.items.map(item => item.id),
            quantities: this.props.cart.items.map(item => item.quantity)
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
    async handleNext() {
        const { activeStep, address } = this.state;

        // Users are submitting the form for their address validate it
        if(activeStep === 1) {
            const addressErrors = this.validateAddress(address);
            // True if there are any errors in the map
            if(Object.values(addressErrors).filter(Boolean).length > 0) {
                console.log('Errors found in address: ', addressErrors);
                this.setState({ addressErrors });
                return;
            } else {
               await this.persistAddress();
            }
        }

        if(activeStep === 2) {
            console.log("Creating stripe session");
            await this.createStripeSession();
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
    async createStripeSession() {
        await this.props.createStripeSession(this.props.stripe.address);
        const { error } = await stripe.redirectToCheckout({
            sessionId: this.props.stripe.session.session_id,
        });

        if(error) {
            console.log("Error redirecting user to stripe checkout page: ", error);
            this.props.stripeError('Something went wrong redirecting you to the checkout page. Refresh the page and try again.');
        }
    }

    /**
     * Handles updating local state when form fields are entered
     */
    onFieldUpdate(value, field) {
        this.setState((prevState) => ({
            address: {
                ...prevState.address,
                [field]: value,
            }
        }))
    }

    /**
     * Renders the proper content for a step when a user is going through
     * the checkout process
     * @param step Int the currently active step number
     * @returns {*}
     */
    renderStep(step) {
        switch(step) {
            case 1:
                return <StepTwo
                        onFieldUpdate={(value, field) => this.onFieldUpdate(value, field)}
                        errors={this.state.addressErrors}
                    />;
            case 0:
            case 2:
            default:
                return (
                    <StepOne
                        mutable={step === 0}
                        header="Your Cart"
                        items={this.props.cart.items}
                        onUpdateQuantity={(uuid, value) => this.props.updateQuantity(uuid, value)}
                        onRemove={(uuid) => this.props.removeAllFromCart(uuid)}
                    />
                );
        }
    }

    render() {
        if(this.props.cart.items.length === 0)
            return this.renderEmptyCart();
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={this.props.stripe.error !== null}
                    autoHideDuration={6000}
                    onClose={() => this.setState({ showErrorMessage: false, errorMessage: '' })}
                >
                    <SnackbarContent
                        message={
                            <span>
                                <Icon name="warning" />
                                { this.props.stripe.error }
                            </span>
                        }
                        action={<Icon name="cancel" onClick={() => this.setState({ showErrorMessage: false, errorMessage: '' })} />}
                    />
                </Snackbar>
                <div className="row page-bg-gray">
                    <div className="col-md-6 ml-auto mr-auto">
                        <Stepper activeStep={this.state.activeStep} alternativeLabel>
                            {
                                this.state.steps.map(label => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))
                            }
                        </Stepper>
                    </div>
                </div>
                <div className="row page-bg-gray">
                    <div className="col-md-5 ml-auto my-4">
                        { this.renderStep(this.state.activeStep) }
                    </div>
                    <div className="col-md-4 margin-custom">
                        <Card>
                            <Card.Content header={
                                <div>
                                <div className="d-flex">
                                    <span className="font-sm">Subtotal</span>
                                    <span className="ml-auto font-sm">
                                        ${
                                            (this.props.cart.items.reduce((prev, curr) => ({ price: (curr.price * curr.quantity) + prev.price, }), { price: 0, quantity: 0 }).price / 100).toFixed(2)
                                        }
                                    </span>
                                </div>
                                    {
                                        this.state.activeStep === 2 &&
                                        <div>
                                            <div className="d-flex">
                                                <span className="font-sm">Tax</span>
                                                <span className="ml-auto font-sm">
                                                ${(this.props.stripe.address.tax / 100).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="d-flex">
                                                <span className="font-sm">Shipping</span>
                                                <span className="ml-auto font-sm">
                                                ${(this.props.stripe.address.shippingCost / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            } />
                            <Card.Content>
                                <div className="d-flex flex-column">
                                    {
                                        this.state.activeStep === 2 &&
                                        <div className="d-flex flex-row">
                                            <h5 className="mb-3 mt-2">Total</h5>
                                            <h5 className="ml-auto mb-3 mt-2">
                                            ${(this.props.stripe.address.total / 100).toFixed(2)}
                                            </h5>
                                        </div>
                                    }
                                    <Button
                                        primary
                                        onClick={(e, f) => this.handleNext(e, f)}
                                        loading={this.props.stripe.isFetching} className="mb-2"
                                        disabled={this.state.activeStep >= this.state.steps.length || this.props.stripe.error || this.props.stripe.isFetching}
                                    >
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
