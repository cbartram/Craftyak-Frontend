import React, { Component } from 'react';
import { connect } from 'react-redux';
import withContainer from "../../components/withContainer";
import './CheckoutSuccess.css';
import {Header, Image, Menu} from "semantic-ui-react";
import {GET_SESSION_ENDPOINT, getRequestUrl} from "../../constants";
import {Link} from "react-router-dom";

const mapStateToProps = state => ({
  auth: state.auth,
});

class CheckoutSuccess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      sessionId: null,
    }
  }

  componentDidMount() {
    const sessionId = new URLSearchParams(document.location.search).get("session_id");
    const params = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.auth.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    fetch(getRequestUrl(GET_SESSION_ENDPOINT) + sessionId, params)
      .then(res => res.json())
      .then(res => {
        this.setState({
          items: res.display_items.filter(item => item.custom.name !== 'Sales Tax' && item.custom.name !== 'Shipping'),
          sessionId
        })
      }).catch(err => {
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
                  <p className="common-body-text">Your order has been created successfully and we are working to get it processed
                    and shipped shortly. Your order ID is: <b>{this.state.sessionId}</b>. Keep this for your records
                    so we can locate your order in the future.</p>
                  <p>You should receive an email with your tracking number and shipping details within 15 minutes!</p>
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
                    this.state.items.map((product, i) => {
                      return (
                          <Menu key={`${product.id}-${i}`}>
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

export default withContainer(connect(mapStateToProps)(CheckoutSuccess));
