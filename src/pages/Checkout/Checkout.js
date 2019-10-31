import React, { Component } from "react";
import { connect } from 'react-redux';
import {
    Header,
    Menu,
    Image,
    Dropdown,
    Button,
    Card
} from "semantic-ui-react";
import { StepOne } from './StepOne';
import { Link } from 'react-router-dom';
import withContainer from "../../components/withContainer";
import './Checkout.css';
import times from "lodash/times";
import { removeAllFromCart, updateQuantity} from "../../actions/actions";
import {CREATE_PAYMENT_ENDPOINT, getRequestUrl} from "../../constants";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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
            steps: ['Review', 'Shipping', 'Checkout']
        }
    }

    setActiveStep(step) {
        this.setState({ activeStep: step })
    }


    handleNext() {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1
        }));
    };

    handleBack() {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep - 1
        }));
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
                    body: JSON.stringify({ products: this.props.cart.items }),
                };

                const response = await fetch(getRequestUrl(CREATE_PAYMENT_ENDPOINT), params);
                const { session_id } = await(response).json();
                console.log("Stripe session ID: ", session_id);
                const {error} = await stripe.redirectToCheckout({
                    sessionId: session_id,
                });

                if(error) {
                    console.log("Error redirecting user to stripe checkout page: ", error);
                }

            } catch(err) {
                console.log("[ERROR] Error creating new stripe session: ", err);
            } finally {
                this.setState({ loading: false });
            }
        });
    }


    renderStep(step) {
        switch(step) {
            case 0:
                return (
                    <StepOne
                        items={this.props.cart.items}
                        onUpdateQuantity={(uuid, value) => this.props.updateQuantity(uuid, value)}
                        onRemove={(uuid) => this.props.removeAllFromCart(uuid)}
                    />
                );
            case 1:
                return <h2>Step 2</h2>;
            case 2:
                return <h3>Step 3</h3>;
        }
    }

    render() {
        if(this.props.cart.items.length === 0)
            return this.renderEmptyCart();
        return (
            <div>
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
                                        // TODO this is wrong
                                            this.props.cart.items.reduce((prev, curr) => ({ price: (curr.price * curr.quantity) + prev.price, })).price
                                        }
                                    </span>
                                </div>
                            } />
                            <Card.Content>
                                <div className="d-flex flex-column">
                                    <Button primary onClick={(e, f) => this.handleNext(e, f)} className="mb-2">
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
