import React, { Component } from 'react';
import withContainer from "../../components/withContainer";
import './CheckoutSuccess.css';
import {Button, Header, Image, Menu} from "semantic-ui-react";
import {GET_SESSION_ENDPOINT, getRequestUrl} from "../../constants";
import {Link} from "react-router-dom";

class CheckoutSuccess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    const sessionId = new URLSearchParams(document.location.search).get("session_id");
    console.log(sessionId);
    const params = {
      method: 'GET',
      headers: {
        Authorization: 'foo',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': 'api-key',
      },
    };

    const response = fetch(getRequestUrl(GET_SESSION_ENDPOINT) + sessionId, params)
        .then(res => res.json())
        .then(res => this.setState({ items: res.display_items })).catch(err => {
          console.log("There was an error retrieving the stripe session: ", err);
        });
  }

  render() {
      return (
          <div>
            <div className="row page-bg-gray">
              <div className="col-md-4 ml-auto mr-auto">
                <h2>Order Created Successfully</h2>
              </div>
            </div>
            <div className="row page-bg-gray">
              <div className="col-md-8 ml-auto mr-auto">
                <div>
                  <Header as="h2" className="header-muted">Your Order</Header>
                  {
                    this.state.items.map(product => {
                      return (
                          <Menu key={product.id}>
                            <Menu.Item position="left">
                              <Image src={product.custom.images[0]} heigh={60} width={60}/>
                            </Menu.Item>
                            <Menu.Item position="left">
                              {product.custom.name} ({product.quantity})
                            </Menu.Item>
                            <Menu.Item>
                              ${(product.amount / 100).toFixed(2)}
                            </Menu.Item>
                            <Menu.Item position="right">
                              <div className="d-flex flex-column">
                                <Link to={`/product/${product.custom.description}`}>Buy Again</Link>
                              </div>
                            </Menu.Item>
                          </Menu>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(CheckoutSuccess);
