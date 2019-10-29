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

  handleClose() {
    console.log("Modal closed");
  }

  render() {
      return (
          <Modal size="small" open={this.props.open} onClose={() => this.handleClose()}>
            <Modal.Header>Delete Your Account</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete your account</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative>No</Button>
              <Button
                  positive
                  icon='checkmark'
                  labelPosition='right'
                  content='Yes'
              />
            </Modal.Actions>
          </Modal>
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);
