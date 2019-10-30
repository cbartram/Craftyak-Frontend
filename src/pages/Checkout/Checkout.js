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
import { Link } from 'react-router-dom';
import withContainer from "../../components/withContainer";
import './Checkout.css';
import times from "lodash/times";
import {createStripePayment, removeAllFromCart, updateQuantity} from "../../actions/actions";

const mapStateToProps = (state) => ({
    cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
    removeAllFromCart: (payload) => dispatch(removeAllFromCart(payload)),
    updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
    createStripePayment: (payload) => dispatch(createStripePayment(payload))
});

/**
 * A functional component which is shown when the rout returns a 404
 * @returns {*}
 */
class Checkout extends Component {
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

    render() {
        if(this.props.cart.items.length === 0)
            return this.renderEmptyCart();
        return (
            <div>
                <div className="row page-bg-gray">
                    <div className="col-md-5 ml-auto my-4">
                        <Header as="h2" className="header-muted">Your Cart</Header>
                        {
                                        this.props.cart.items.map(product => {
                                            return (
                                                <Menu key={product.uuid}>
                                                    <Menu.Item position="left">
                                                        <Image src={product.heroImage} heigh={60} width={60}/>
                                                    </Menu.Item>
                                                    <Menu.Item position="left">
                                                        {product.name}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        ${product.price}
                                                    </Menu.Item>
                                                    <Menu.Item position="right">
                                                        <div className="d-flex flex-column">
                                                            <Dropdown
                                                                className="mt-2"
                                                                placeholder="1"
                                                                compact
                                                                selection
                                                                value={product.quantity}
                                                                onChange={(e, data) => this.props.updateQuantity(product.uuid, data.value)}
                                                                options={
                                                                    times(10, (index) => ({
                                                                        key: index + 1,
                                                                        text: index + 1,
                                                                        value: index + 1,
                                                                    }))}
                                                            />
                                                            <Button className="button-link button-link-danger"
                                                                    onClick={() => this.props.removeAllFromCart(product.uuid)}>Remove</Button>
                                                        </div>
                                                    </Menu.Item>
                                                </Menu>
                                            )
                                        })
                        }
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
                                <Button primary onClick={() => this.props.createStripePayment({ products: this.props.cart.items })}>Checkout</Button>
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
