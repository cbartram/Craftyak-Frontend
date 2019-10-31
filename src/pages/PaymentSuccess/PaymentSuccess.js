import React, { Component } from 'react';
import withContainer from "../../components/withContainer";
import './PaymentSuccess.css';
import {Segment} from "semantic-ui-react";

class PaymentSuccess extends Component {
    render() {
        return (
            <Segment style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <h1>Your payment was successful</h1>
              <p>You will receive your order shortly!</p>
            </Segment>
        );
    }
  }

export default withContainer(PaymentSuccess);
