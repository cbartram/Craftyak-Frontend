import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import withContainer from '../../components/withContainer';
import './ProductDetail.css';

class ProductDetail extends Component {
  render() {
    console.log(this.props);
      return <h1>ProductDetail</h1>
  }
}

export default withRouter(withContainer(ProductDetail));
