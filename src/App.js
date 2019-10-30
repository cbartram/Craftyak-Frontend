import React, { Component } from 'react';
import { connect } from 'react-redux'
import map from 'lodash/map';
import uuid from 'lodash/uniqueId';
import times from 'lodash/times';
import withContainer from "./components/withContainer";
import {
    Icon,
    Card,
    Image,
    Button,
    Placeholder,
    Sticky,
    Responsive,
    Menu,
    Dropdown
} from 'semantic-ui-react'
import Sidebar from "./components/Sidebar/Sidebar";
import {
    addToCart,
    filterProducts,
    removeFromCart,
    updateSortOptions
} from "./actions/actions";
import Logo from "./resources/images/Crafty_Yak_Logo.png";
import './App.css';

const mapStateToProps = (state) => ({
    products: state.products,
    cart: state.cart,
});

const mapDispatchToProps = (dispatch) => ({
    addToCart: (payload) => dispatch(addToCart(payload)),
    removeFromCart: (payload) => dispatch(removeFromCart(payload)),
    updateSortOptions: (payload) => dispatch(updateSortOptions(payload)),
    filterProducts: (payload) => dispatch(filterProducts(payload)),
});

class App extends Component {
    constructor(props) {
        super(props);

        this.stickyRef = React.createRef();
        this.state = {
            sticky: false,
            open: false,
            productQuantity: {},
        };
    }

    /**
     * Fetches products to show to users from
     * the REST API endpoints
     */
    componentDidMount() {
        // SCROLL_TOP_OFFSET is the height when the sub navbar becomes sticky
        const SCROLL_TOP_OFFSET = 503;
        window.onscroll = () => {
            const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            // console.log(scrollTop);
            if(scrollTop >= SCROLL_TOP_OFFSET) {
                this.setState({ sticky: true });
            } else if(scrollTop < SCROLL_TOP_OFFSET) {
                this.setState({ sticky: false });
            }
        }
    }

    /**
     * Updates the quantity for each product
     * @param quantity
     * @param productId
     */
    updateQuantity(quantity, productId) {
        const { productQuantity } = this.state;
        this.setState({ productQuantity: { ...productQuantity, [productId]: quantity } });
    }


    /**
     * Renders a set of placeholder cards while the real arts are loading
     * @param loading
     * @returns {Array}
     */
    renderCards(loading = this.props.products.isFetching) {
        return map(this.props.products.items || [{}, {}, {}, {}, {}], product => (
            <Card key={product.id} className="col-md-3 col-lg-3 offset-md-2 col-sm-5 d-flex align-items-stretch m-2">
                {
                    loading ?
                        <Placeholder>
                            <Placeholder.Image square />
                        </Placeholder>
                        : <Image src={product.heroImage} wrapped ui />
                }
                {
                    loading ?
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header>
                                    <Placeholder.Line length='very short' />
                                    <Placeholder.Line length='long' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='short' />
                                    <Placeholder.Line length='medium' />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Card.Content>
                        :
                        <Card.Content>
                            <Card.Header>{product.name}</Card.Header>
                            <Card.Meta>
                                <span className='date'>${product.price}</span>
                            </Card.Meta>
                            <Card.Description>
                                {product.description}
                            </Card.Description>
                            <Button primary className="mt-3" onClick={() => this.props.addToCart({
                                ...product,
                                quantity: this.state.productQuantity[product.id] || 1,
                                uuid: uuid('product-')
                            })}>
                                Add to Cart &nbsp; <Icon name="plus" />
                            </Button>
                            <Dropdown
                                className="mt-2"
                                placeholder="1"
                                compact
                                selection
                                onChange={(e, data) => this.updateQuantity(data.value, product.id)}
                                options={
                                times(10, (index) => ({
                                    key: index + 1,
                                    text: index + 1,
                                    value: index + 1,
                                }))}
                            />
                        </Card.Content>
                }
                {
                    loading ?
                        <Card.Content extra>
                            <Placeholder>
                                <Placeholder.Header>
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                        :
                        <Card.Content extra>
                            <Icon name="truck" />
                            Shipping {product.processingTime} days
                        </Card.Content>
                }
            </Card>
        ));
    }

    /**
     * Handles dispatching an action when a new
     * dropdown sort selection is made
     * @param data String enum representing the level or sorting for products
     */
    handleSortClick(data) {
        this.props.updateSortOptions(data);
    }

    /**
     * Renders a set of items in the cart with a purple
     * badge representing the number of items.
     * @returns {*}
     */
    renderCartItems() {
        if(this.props.cart.items.length === 0)
            return <Icon name="cart" className="gray-title" />;
        else
            return <div>
                <Icon name="cart" className="gray-title" />
                <span className="badge badge-primary">
                    {this.props.cart.items.length}
                </span>
            </div>
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="box">
                            <img alt="" role="presentation"
                                 src="https://a0.muscache.com/4ea/air/v2/pictures/ea6285d9-5352-4447-b13d-b39bfc92dfe5.jpg?t=c:w1131-h343,r:w1131-h343-sfit,e:fjpg-c75"
                                 srcSet="https://a0.muscache.com/4ea/air/v2/pictures/ea6285d9-5352-4447-b13d-b39bfc92dfe5.jpg?t=c:w1131-h343,r:w1131-h343-sfit,e:fjpg-c75 1131w,https://a0.muscache.com/4ea/air/v2/pictures/ea6285d9-5352-4447-b13d-b39bfc92dfe5.jpg?t=c:w2262-h686,r:w2262-h686-sfit,e:fjpg-c75 2262w,https://a0.muscache.com/4ea/air/v2/pictures/ea6285d9-5352-4447-b13d-b39bfc92dfe5.jpg?t=c:w3393-h1029,r:w3393-h1029-sfit,e:fjpg-c75 3393w"
                                 style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center'}} />
                            <div className="text">
                                <h1 className="gray-title">Crafty Yak</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Sticky pushing>
                            <Responsive>
                                <Menu fluid pointing secondary>
                                    {
                                        this.state.sticky &&
                                        <Menu.Item className="menu-logo">
                                            <img alt="logo" src={Logo}/>
                                        </Menu.Item>
                                    }
                                    <Menu.Item>
                                        <Icon name="list" style={{ color: '#6c757d'}} />
                                        <span className="text-muted">Filter</span>
                                    </Menu.Item>
                                    <Menu.Item position="right">
                                        {
                                            this.state.sticky &&
                                            this.renderCartItems()
                                        }
                                    </Menu.Item>
                                    <Menu.Item>
                                        <span className="text-muted">Sort By:</span> &nbsp;
                                        <div className="dropdown">
                                            <a className="dropdown-toggle" href="#null" id="dropdownMenuButton" data-toggle="dropdown">
                                                { this.props.products.sort.formattedText }
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" onClick={() => this.handleSortClick("PRODUCT_TYPE")} href="#product_type">Product Type</a>
                                                <a className="dropdown-item" onClick={() => this.handleSortClick("NEWEST")} href="#newest">Newest</a>
                                                <a className="dropdown-item" onClick={() => this.handleSortClick("PRICE_HL")} href="#price_hl">Price: High to Low</a>
                                                <a className="dropdown-item" onClick={() => this.handleSortClick("PRICE_LH")} href="#price_lh">Price: Low to High</a>
                                            </div>
                                        </div>
                                    </Menu.Item>
                                </Menu>
                            </Responsive>
                        </Sticky>
                    </div>
                </div>
                <div className="row">
                    <Sidebar
                        sticky={this.state.sticky}
                        products={this.props.products}
                        onFilter={(checkbox) => this.props.filterProducts(checkbox)}
                    />
                    <main role="main" className="col-md-10 ml-sm-auto col-lg-10 px-4" ref={this.stickyRef}>
                        <div className="row" >
                            { this.renderCards() }
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(App));
