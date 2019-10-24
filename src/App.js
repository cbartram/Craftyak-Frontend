import React, { Component } from 'react';
import { connect } from 'react-redux'
import withContainer from "./components/withContainer";
import {
    Header,
    Icon,
    Menu,
    Segment,
    Sidebar,
    Card,
    Image,
    Button,
    Accordion,
    Form
} from 'semantic-ui-react'
import './App.css';
import {getProducts} from "./actions/actions";

const mapStateToProps = (state) => {
    return {
        products: state.products
    }
};

const mapDispatchToProps = (dispatch) => ({
    getProducts: (payload) => dispatch(getProducts(payload)),
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
    constructor() {
        super();

        this.state = {
            activeIndex: 0
        }
    }

    /**
     * Handles the click event for switching the actively shown dropdown
     * in the accordion
     **/
    handleClick = (e, { index }) => {
        const { activeIndex } = this.state;
        this.setState({ activeIndex: activeIndex === index ? -1 : index })
    };


    componentDidMount() {
        this.props.getProducts();
    }

    render() {
        const { activeIndex } = this.state;
        return (
            <div>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation="push"
                        direction="left"
                        vertical
                        visible
                        style={{ overflowX: 'hidden', background: 'white' }}
                    >
                        <Accordion as={Menu} vertical className="accordion-menu">
                            <Menu.Header className="pt-3 pl-3 pb-2">
                            <Icon size="small" name="list" />
                                Filters
                            </Menu.Header>
                            <hr />
                            <Menu.Item>
                                <Accordion.Title
                                    active={activeIndex === 1}
                                    content="Category"
                                    index={1}
                                    onClick={this.handleClick}
                                />
                                <Accordion.Content active={activeIndex === 1} content={ColorForm} icon="question" />
                            </Menu.Item>
                            <Menu.Item>
                                <Accordion.Title
                                    active={activeIndex === 2}
                                    content="Price"
                                    index={2}
                                    onClick={this.handleClick}
                                />
                                <Accordion.Content active={activeIndex === 2} content={ColorForm} />
                            </Menu.Item>
                            <Menu.Item>
                                <Accordion.Title
                                    active={activeIndex === 3}
                                    content="Color"
                                    index={3}
                                    onClick={this.handleClick}
                                />
                                <Accordion.Content active={activeIndex === 3} content={ColorForm} />
                            </Menu.Item>
                        </Accordion>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic>
                            <Card.Group itemsPerRow={5}>
                                {
                                    this.props.products.items.map(product => {
                                        return (

                                            <Card>
                                                <Image src={product.heroImage} wrapped ui={false} />
                                                <Card.Content>
                                                    <Card.Header>{product.name}</Card.Header>
                                                    <Card.Meta>
                                                        <span className='date'>${product.price}</span>
                                                    </Card.Meta>
                                                    <Card.Description>
                                                        {product.description}
                                                    </Card.Description>
                                                    <Button>
                                                        Add to Card &nbsp; <Icon name="plus" />
                                                    </Button>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <Icon name="truck" />
                                                    Shipping {product.processingTime} days
                                                </Card.Content>
                                            </Card>
                                        )
                                    })
                                }
                            </Card.Group>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(App));
