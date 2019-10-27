import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Menu,
    Input,
    Button,
    Dropdown,
    List,
    Image,
    Icon
} from 'semantic-ui-react'
import Logo from '../../resources/images/Crafty_Yak_Logo.png';
import './Navbar.css';
import {removeFromCart} from "../../actions/actions";

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = (dispatch) => ({
    removeFromCart: (payload) => dispatch(removeFromCart(payload)),
});

/**
 * Basic Navbar Component which is fixed to the top of the page
 * @returns {*}
 * @constructor
 */
class Navbar extends Component {

    renderCartItems() {
        if(this.props.cart.items.length === 0)
            return <Icon name="cart" />;
        else
            return <div>
                        <Icon name="cart" />
                        <span className="badge badge-primary">
                            {this.props.cart.items.length}
                        </span>
                    </div>
    }

    render() {
        return (
            <Menu stackable className="menu-navbar">
                <Menu.Item className="menu-logo">
                    <img alt="logo" src={Logo}/>
                    <span className="cursive-logo ml-2">Crafty Yak</span>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Input icon="search" placeholder="Search"/>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown
                            item
                            icon={this.renderCartItems()}
                            closeOnChange={false}
                            closeOnBlur
                            className="cart-dropdown"
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header content="You're Cart" />
                                {
                                    this.props.cart.items.length === 0 ?
                                        <Dropdown.Item>
                                            No items in the cart!
                                        </Dropdown.Item> :
                                        this.props.cart.items.map(product => {
                                            return (
                                                <Dropdown.Item key={product.uuid}>
                                                    <List relaxed>
                                                        <List.Item>
                                                            <Image avatar src={product.heroImage} />
                                                            <List.Content>
                                                                <List.Header as='h4'>
                                                                    {product.name}
                                                                    &nbsp;
                                                                    <Button className="hidden" size="mini" icon onClick={() => this.props.removeFromCart(product.uuid)}>
                                                                        <Icon name="x" />
                                                                    </Button>
                                                                </List.Header>
                                                                <List.Description>
                                                                    ${product.price}
                                                                </List.Description>
                                                            </List.Content>
                                                        </List.Item>
                                                    </List>
                                                </Dropdown.Item>
                                            )
                                        })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Button primary className="pill">
                            Checkout
                        </Button>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
