import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withContainer from '../../components/withContainer';
import times from 'lodash/times';
import uniqueId from 'lodash/uniqueId';
import './ProductDetail.css';
import {
  Button,
  Card,
  Dropdown,
  Select,
  List
} from "semantic-ui-react";
import ImageGallery from 'react-image-gallery';
import { updateQuantity } from "../../actions/actions";
import { format, getAttributeValues} from "../../util";

const mapStateToProps = state => ({
  products: state.products.items,
});

const mapDispatchToProps = dispatch => ({
  updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
});

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
    }
  }

  componentDidMount() {
    // Find the product from the slug
    const product = this.props.products.filter(product => product.metadata.slug === this.props.match.params.slug)[0];
    console.log(product);
    this.setState({ product });
  }

  render() {
      if(this.state.product === null) {
        return null;
      }

      return (
          <div>
            <div className="row my-3">
              <div className="col-md-8">
                <ImageGallery
                    showPlayButton={false}
                    items={this.state.product.images.map(image => ({ original: image, thumbnail: image }))}
                />
              </div>
              <div className="col-md-3">
                <Card>
                  <Card.Content header={
                    <div className="d-flex">
                      <span style={{ fontSize: 17 }}>
                        ${ this.state.product.metadata.price }
                      </span>
                    </div>
                  } />

                  <Card.Content>
                    {
                      this.state.product.attributes.map(attribute => {
                        return (
                            <div key={uniqueId()}>
                              <span>{format(attribute)}</span>
                              <div>
                                <Select className="my-2" placeholder={`Select a ${attribute}`} options={getAttributeValues(attribute)} />
                              </div>
                            </div>
                        )
                      })
                    }

                    <span>Quantity</span>
                    <div>
                    <Dropdown
                        className="my-2"
                        placeholder="1"
                        compact
                        selection
                        value={this.state.product.quantity}
                        onChange={(e, data) => this.props.updateQuantity(this.state.product.id, data.value)}
                        options={
                          times(10, (index) => ({
                            key: index + 1,
                            text: index + 1,
                            value: index + 1,
                          }))}
                    />
                    </div>
                    <div className="d-flex flex-column">
                      <Button primary onClick={() => {}} className="mb-2">
                        Add to Cart
                      </Button>
                      <span className="text-muted-small">
                          Tax and shipping will be calculated at checkout.
                      </span>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Content header="Item Details"/>
                  <Card.Content>
                    <h3>Description</h3>
                    <p className="common-body-text">{ this.state.product.description }</p>
                    <h3>Package Details</h3>
                    <List>
                      <List.Item>
                        <List.Header>Height</List.Header>
                        { this.state.product.package_dimensions.height} in
                      </List.Item>
                      <List.Item>
                        <List.Header>Length</List.Header>
                        { this.state.product.package_dimensions.length} in
                      </List.Item>
                      <List.Item>
                        <List.Header>Width</List.Header>
                        { this.state.product.package_dimensions.width} in
                      </List.Item>
                      <List.Item>
                        <List.Header>Weight</List.Header>
                        { this.state.product.package_dimensions.weight} oz
                      </List.Item>
                    </List>
                    <h3>Shipping</h3>
                    <p>Made just for you ready to ship in 3-5 days.</p>
                    <h3>Return Policy</h3>
                    <p>
                      No Returns
                    </p>
                  </Card.Content>
                </Card>


              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductDetail)));
