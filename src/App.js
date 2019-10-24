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
    Grid,
    Image
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


class App extends Component {
  componentDidMount() {
      this.props.getProducts();
  }

    render() {
      return (
          <div>
              <Sidebar.Pushable as={Segment}>
                  <Sidebar
                      as={Menu}
                      animation="push"
                      direction="left"
                      icon='labeled'
                      vertical
                      visible
                      width='thin'
                  >
                      <Menu.Item as="h4">
                          Filters
                          <Icon name="filter" />
                      </Menu.Item>
                      <Menu.Item as="a">
                          <Icon name="list" />
                          Category
                      </Menu.Item>
                      <Menu.Item as="a">
                          <Icon name="dollar sign" />
                          Price
                      </Menu.Item>
                      <Menu.Item as="a">
                          <Icon name="paint brush" />
                            Colors
                      </Menu.Item>
                  </Sidebar>
                  <Sidebar.Pusher>
                      <Segment basic>
                          <Header as='h3'>Application Content</Header>
                          <Grid doubling columns={3}>
                              {
                                this.props.products.items.map(product => {
                                   return (
                                       <Grid.Column>
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
                                        </Card.Content>
                                        <Card.Content extra>
                                                <Icon name="truck" />
                                                Shipping {product.processingTime} days
                                        </Card.Content>
                                    </Card>
                                   </Grid.Column>
                                   )
                                })
                              }
                          </Grid>
                      </Segment>
                  </Sidebar.Pusher>
              </Sidebar.Pushable>
          </div>
      );
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(App));
