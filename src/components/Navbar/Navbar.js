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
    Search, Responsive
} from 'semantic-ui-react'
import Logo from '../../resources/images/Crafty_Yak_Logo.png';
import { removeFromCart } from "../../actions/actions";
import { matchSearchQuery } from "../../util";
import { Link, withRouter } from 'react-router-dom';
import { Auth0Context } from "../../util/auth0-spa";
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

    static contextType = Auth0Context;


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
            return <Icon name="cart" className="gray-title" onClick={() => this.props.history.push('/checkout')} />;
        else
            return <div>
                <Icon name="cart" className="gray-title" onClick={() => this.props.history.push('/checkout')} />
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
                {/*<Image avatar height={30} width={30} src={item.images[0]} />*/}
                <div className="d-flex flex-column">
                    {matchSearchQuery(this.state.value, item.name)}
                    <small className="text-muted">${item.metadata.price}</small>
                </div>
            </div>
        )
    }

    handleResultSelect(e, { result }) {
        this.props.history.push(`/product/${result.metadata.slug}`);
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
        const { isAuthenticated, loginWithRedirect, logout } = this.context;
        return (
            <div>
                <Menu stackable className="menu-navbar">
                    <Menu.Item className="menu-logo">
                        <img alt="logo" src={Logo} onClick={() => this.props.history.push("/")}/>
                        <span className="cursive-logo ml-2">Crafty Yak</span>
                    </Menu.Item>
                    <Responsive minWidth={768} style={{ marginLeft: 'auto' }}>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            {
                                !isAuthenticated &&
                                <Search
                                    className="global-search"
                                    placeholder="Search"
                                    loading={this.state.isLoading}
                                    onResultSelect={(e, f) => this.handleResultSelect(e, f)}
                                    onSearchChange={debounce(this.handleSearchChange, 300, {leading: true})}
                                    results={this.state.results}
                                    value={this.state.value}
                                    resultRenderer={(item) => this.renderSearchRow(item)}
                                />
                            }
                        </Menu.Item>
                        { !isAuthenticated &&
                        <Menu.Item>
                            { this.renderCartItems() }
                        </Menu.Item>
                        }
                        <Menu.Item>
                            {
                                !isAuthenticated && this.props.history.location.pathname !== '/checkout' &&
                                <Button as={Link} to="/checkout" primary className="pill">
                                    Checkout
                                </Button>
                            }
                        </Menu.Item>
                        <Menu.Item>
                            {isAuthenticated && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                        </Menu.Item>
                        <Menu.Item>
                            {isAuthenticated &&
                            <Button primary style={{minWidth: 0}} icon onClick={() => logout()}>
                                <Icon name="sign-out" />
                            </Button>
                            }
                        </Menu.Item>
                    </Menu.Menu>
                    </Responsive>
                </Menu>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
