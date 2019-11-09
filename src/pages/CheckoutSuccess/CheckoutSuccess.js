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
              <div className="col-md-5 ml-auto mr-auto">
                <div className="my-4">
                  <Header as="h2" className="header-muted">Your Order</Header>
                  <p className="common-body-text">Your order has been created successfully. Your tracking number is
                    XXXX and your order has been shipped with UPS. To track or manager your order please use this link.</p>
                  <Menu>
                    <Menu.Item position="left">
                      <b>Image</b>
                    </Menu.Item>
                    <Menu.Item position="left">
                      <b>Item Name & Quantity</b>
                    </Menu.Item>
                    <Menu.Item>
                      <b>Price per Item</b>
                    </Menu.Item>
                    <Menu.Item position="right">
                      <div className="d-flex flex-column">
                        <b>Actions</b>
                      </div>
                    </Menu.Item>
                  </Menu>
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
