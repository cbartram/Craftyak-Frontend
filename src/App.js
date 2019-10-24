import React, { Component } from 'react';
import { connect } from 'react-redux';
import withContainer from "./components/withContainer";
import {
    Header,
    Icon,
    Menu,
    Segment,
    Sidebar,
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
                      <Menu.Item as='a'>
                          <Icon name='home' />
                          Home
                      </Menu.Item>
                      <Menu.Item as='a'>
                          <Icon name='gamepad' />
                          Games
                      </Menu.Item>
                      <Menu.Item as='a'>
                          <Icon name='camera' />
                          Channels
                      </Menu.Item>
                  </Sidebar>
                  <Sidebar.Pusher>
                      <Segment basic>
                          <Header as='h3'>Application Content</Header>
                      </Segment>
                  </Sidebar.Pusher>
              </Sidebar.Pushable>
          </div>
      );
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(App));
