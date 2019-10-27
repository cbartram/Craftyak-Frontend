import React, { Component } from 'react';
import { connect } from 'react-redux'
import map from 'lodash/map';
import uuid from 'lodash/uniqueId';
import withContainer from "./components/withContainer";
import {
    Icon,
    Card,
    Image,
    Button,
    Form,
    Placeholder,
    Sticky,
    Responsive,
    Menu,
    Dropdown
} from 'semantic-ui-react'
import './App.css';
import Sidebar from "./components/Sidebar/Sidebar";
import {addToCart, getProducts, removeFromCart} from "./actions/actions";
import Logo from "./resources/images/Crafty_Yak_Logo.png";

const mapStateToProps = (state) => {
    return {
        products: state.products,
        cart: state.cart
    }
};

const mapDispatchToProps = (dispatch) => ({
    getProducts: (payload) => dispatch(getProducts(payload)),
    addToCart: (payload) => dispatch(addToCart(payload)),
    removeFromCart: (payload) => dispatch(removeFromCart(payload))
});

const ColorForm = (
    <Form>
        <Form.Group grouped>
            <Form.Checkbox label='Red' name='color' value='red' />
            <Form.Checkbox label='Orange' name='color' value='orange' />
            <Form.Checkbox label='Green' name='color' value='green' />
            <Form.Checkbox label='Blue' name='color' value='blue' />
        </Form.Group>
    </Form>
);

class App extends Component {
    constructor(props) {
        super(props);

        this.stickyRef = React.createRef();
        this.state = {
            sticky: false
        };
    }

    /**
     * Handles the click event for switching the actively shown dropdown
     * in the accordion
     **/
    handleClick = (e, { index }) => {
        const { activeIndex } = this.state;
        this.setState({ activeIndex: activeIndex === index ? -1 : index })
    };

    /**
     * Fetches products to show to users from
     * the REST API endpoints
     */
    componentDidMount() {
        const SCROLL_TOP_OFFSET = 394;
        this.props.getProducts();
        window.onscroll = () => {
            const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            // 70px is the height when the sub navbar becomes sticky
            if(scrollTop >= SCROLL_TOP_OFFSET) {
                this.setState({ sticky: true });
            } else if(scrollTop < SCROLL_TOP_OFFSET) {
                this.setState({ sticky: false });
            }
        }
    }

    /**
     * Renders a set of placeholder cards while the real arts are loading
     * @param loading
     * @returns {Array}
     */
    renderCards(loading = this.props.products.isFetching) {
        return map(this.props.products.items || [{}, {}, {}, {}, {}], product => (
                <Card key={product.id} className="col-md-4 col-lg-4 col-sm-12 d-flex align-items-stretch m-4">
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
                            <Button primary className="mt-3" onClick={() => this.props.addToCart({ ...product, uuid: uuid('product-') })}>
                                Add to Cart &nbsp; <Icon name="plus" />
                            </Button>
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

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="jumbotron jumbotron-fluid px-3">
                            <h1 className="display-4">Hello, world!</h1>
                            <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling
                                extra attention to featured content or information.</p>
                            <hr className="my-4" />
                                <p>It uses utility classes for typography and spacing to space content out within the larger
                                    container.</p>
                                <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
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
                                    <Menu.Item position="right">
                                        Sort By: &nbsp;
                                        <Dropdown text={this.state}>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text='New' />
                                                <Dropdown.Item text='Product Type' description='ctrl + o' />
                                                <Dropdown.Item text='Category' description='ctrl + o' />
                                                <Dropdown.Item text='Price' description='ctrl + o' />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Menu.Item>
                                </Menu>
                            </Responsive>
                        </Sticky>
                    </div>
                </div>
                <div className="row">
                    <Sidebar sticky={this.state.sticky} />
                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" ref={this.stickyRef}>
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
