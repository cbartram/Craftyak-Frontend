import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withContainer from '../../components/withContainer';
import times from 'lodash/times';
import uniqueId from 'lodash/uniqueId';
import Snackbar from '@material-ui/core/Snackbar';
import './ProductDetail.css';
import {
  Button,
  Card,
  Dropdown,
  Select,
  List, Sticky
} from "semantic-ui-react";
import ImageGallery from 'react-image-gallery';
import { CirclePicker } from 'react-color';
import { updateQuantity } from "../../actions/actions";
import {format, formatPrice, getAttributeValues, getSKU} from "../../util";

const mapStateToProps = state => ({
  products: state.products.items,
});

const mapDispatchToProps = dispatch => ({
  updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
});

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.galleryRef = React.createRef();

    this.state = {
      product: null,
      viableSkus: [], // A set of viable skus which match the criteria selected by the users
      sku: null,
      skuMeta: {}, // Attributes & Quantity for the sku about to be added to the cart
      showErrorMessage: false
    }
  }

  componentDidMount() {
    // Find the product from the slug
    const product = this.props.products.filter(product => product.metadata.slug === this.props.match.params.slug)[0];
    console.log(product);
    console.log(getSKU(product.skus, ['color', 'size', 'material_shirt'], ['Brown', 'Medium', 'Cotton']));
    this.setState({ product });
  }

  /**
   * Finds an SKU
   * @param attribute
   * @param data
   */
  onSelectChange(attribute, data) {
      const viableSkus = this.state.product.skus.filter(sku => sku.attributes[attribute] === data.value);
      if(viableSkus.length === 0) {
        // TODO Search the entire stack of SKU's for a viable one matching multiple criteria
          this.setState({ errorMessage: true });
      } else {
        this.setState({viableSkus, sku: viableSkus[0], skuMeta: { ...this.state.skuMeta, [attribute]: data.value }})
      }
  }

  render() {
      if(this.state.product === null) {
        return null;
      }

      return (
          <div>
              <Snackbar
                  variant="error"
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  open={this.state.showErrorMessage}
                  onClose={() => this.setState({ showErrorMessage: false })}
                  message={<span id="message-id">I love snacks</span>}
              />
            <div className="row my-3">
              <div className="col-md-6 offset-md-2 pl-2" ref={this.galleryRef}>
                <Sticky context={this.galleryRef}>
                <ImageGallery
                    showPlayButton={false}
                    items={this.state.product.images.map(image => ({ original: image, thumbnail: image }))}
                />
                <hr />
                </Sticky>
              </div>
              <div className="col-md-3">
                <Card>
                  <Card.Content header={
                    <div className="d-flex">
                      <span style={{ fontSize: 17 }}>
                        ${
                          this.state.sku === null ?
                              this.state.product.metadata.price :
                              formatPrice(this.state.sku.price)
                        }
                      </span>
                    </div>
                  } />

                  <Card.Content>
                    {
                      this.state.product.attributes.map(attribute => {
                        const id = uniqueId();
                        const attributeValues = getAttributeValues(attribute);
                        if(attribute.toUpperCase() === "COLOR")
                          return (
                              <div key={id}>
                                <span>Color</span>
                                <div className="py-3">
                                  <CirclePicker
                                      onChangeComplete={(color) => this.onSelectChange(attribute, color.hex)}
                                      colors={attributeValues.options}
                                  />
                                </div>
                              </div>
                          );
                        return (
                            <div key={id}>
                              <span>{format(attribute)}</span>
                              <div>
                                <Select
                                    onChange={(e, data) => this.onSelectChange(attribute, data)}
                                    value={this.state.skuMeta[attribute]} className="my-2"
                                    placeholder={`Select a ${attribute}`} options={attributeValues.options}
                                />
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
                        value={this.state.skuMeta.quantity}
                        onChange={(e, data) => this.setState({ skuMeta: { ...this.state.skuMeta, quantity: data.value }})}
                        options={
                          times(10, (index) => ({
                            key: index + 1,
                            text: index + 1,
                            value: index + 1,
                          }))}
                    />
                    </div>
                    <div className="d-flex flex-column">
                      <Button primary onClick={() => {}} className="mb-2" disabled={this.state.product.attributes.length !== Object.keys(this.state.skuMeta).length}>
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
