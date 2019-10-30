import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import {
    Menu,
    Button,
    Dropdown,
    List,
    Image,
    Icon,
    Search
} from 'semantic-ui-react'
import Logo from '../../resources/images/Crafty_Yak_Logo.png';
import { removeFromCart } from "../../actions/actions";
import { matchSearchQuery } from "../../util";
import { Link, withRouter } from 'react-router-dom';
import './Navbar.css';

const mapStateToProps = (state) => ({
    products: state.products,
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
    constructor(props) {
        super(props);

        this.state = {
            results: [], // Holds the results of the search
            data: [], // Holds the full list of data being searched
            value: '',
            isLoading: false,
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleResultSelect = this.handleResultSelect.bind(this);
    }

    componentDidMount() {
        this.setState({ data: this.props.products.items });
    }


    /**
     * Renders a image price, name, and quantity for a set of
     * products in the cart
     * @returns {*}
     */
    renderCartItems() {
        if(this.props.cart.items.length === 0)
            return <Icon name="cart" className="gray-title" />;
        else
            return <div>
                <Icon name="cart" className="gray-title" />
                <span className="badge badge-primary">
                    { this.props.cart.items.reduce((prev, curr) => ({ quantity: curr.quantity + prev.quantity })).quantity }
                 </span>
            </div>
    }

    /**
     * Renders a single row in the search dropdown
     */
    renderSearchRow(item) {
        return (
            <div className="d-flex align-items-center px-3 py-2 search-row-item">
                <Image avatar src={item.heroImage} />
                <div className="d-flex flex-column">
                    {matchSearchQuery(this.state.value, item.name)}
                    <small className="text-muted">${item.price}</small>
                </div>
            </div>
        )
    }

    handleResultSelect(e, { result }) {
        console.log(result);
        // TODO This needs to be implemented somehow
    }

    /**
     * Handles performing a simple search for videos or quizzes
     * @param e Event object
     * @param value String search query
     */
    handleSearchChange(e, { value }) {
        let { data } = this.state;
        data = data.filter(product => product.name.toUpperCase().includes(value.toUpperCase()));
        this.setState({results: data, value})
    }

    render() {
        return (
            <div>
                <Menu stackable className="menu-navbar">
                    <Menu.Item className="menu-logo">
                        <img alt="logo" src={Logo} onClick={() => this.props.history.push("/")}/>
                        <span className="cursive-logo ml-2">Crafty Yak</span>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Search
                                className="global-search"
                                placeholder="Search"
                                loading={this.state.isLoading}
                                onResultSelect={(e, f) => this.handleResultSelect(e, f)}
                                onSearchChange={debounce(this.handleSearchChange, 300, { leading: true })}
                                results={this.state.results}
                                value={this.state.value}
                                resultRenderer={(item) => this.renderSearchRow(item)}
                            />
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
                                                                        ${product.price} &nbsp;
                                                                        <span className="badge badge-primary">{product.quantity}</span>
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
                            {
                                this.props.history.location.pathname !== '/checkout' &&
                                <Button as={Link} to="/checkout" primary className="pill">
                                    Checkout
                                </Button>
                            }
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
