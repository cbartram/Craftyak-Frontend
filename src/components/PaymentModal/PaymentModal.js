import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Button
} from 'semantic-ui-react';
import './PaymentModal.css';

const mapStateToProps = state => ({
  cart: state.cart
});

const mapDispatchToProps = dispatch => ({
  // TODO
});


class PaymentModal extends Component {
  render() {
      return (
          <Modal size="small" open={this.props.open} onClose={() => this.props.onClose()}>
            <Modal.Header>
              <div className="text">
                <h3 className="common-UppercaseText category">Payment Details</h3>
                <h2 className="common-BodyTitle title">Which charges reconcile with our latest bank payout?</h2>
              </div>
            </Modal.Header>
            <Modal.Content>
              <p style={{ color: 'black'}}>Are you sure you want to delete your account</p>
            </Modal.Content>
            <Modal.Actions>

            </Modal.Actions>
          </Modal>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);
