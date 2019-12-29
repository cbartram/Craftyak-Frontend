import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import withContainer from '../../components/withContainer';
import AttributeLabel from "../../components/AttributeLabel/AttributeLabel";
import times from 'lodash/times';
import chunk from 'lodash/chunk';
import uniqueId from 'lodash/uniqueId';
import isUndefined from 'lodash/isUndefined';
import Snackbar from '@material-ui/core/Snackbar';
import WebFont from 'webfontloader';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import './ProductDetail.css';
import {
  Button,
  Card,
  Dropdown,
  Select,
  List,
  Sticky,
  Icon,
  Responsive,
  Modal,
  Image,
  Input,
  Label,
} from "semantic-ui-react";
import ImageGallery from 'react-image-gallery';
import { CirclePicker } from 'react-color';
import { updateQuantity, addToCart } from "../../actions/actions";
import {format, formatPrice, getAttributeValues, getSKU} from "../../util";
import {GOOGLE_FONTS_API_KEY} from "../../constants";

const mapStateToProps = state => ({
  products: state.products.items,
  cart: state.cart,
});

const mapDispatchToProps = dispatch => ({
  updateQuantity: (id, value) => dispatch(updateQuantity({ id, value })),
  addToCart: (quantity, product, sku, message, font) => dispatch(addToCart({
    quantity,
    sku: {
      ...sku,
      name: product.name,
      personalMessage: message,
      font,
      description: product.description,
      images: product.images,
    }
  })),
});

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.galleryRef = React.createRef();

    this.state = {
      product: null,
      sku: null,
      selectedColor: '',
      skuMeta: {}, // Attributes & Quantity for the sku about to be added to the cart
      showErrorMessage: false,
      open: false,
      charsRemaining: 40,
      personalMessage: null,
      fonts: [],
      currentFontIndex: 0,
      slicedFonts: [], // A set of 20 fonts sliced from the fonts array to not overwhelm users
      loadingFonts: true,
      selectedFont: 'Select a Font'
    }
  }

  componentDidMount() {
    // Find the product from the slug
    const product = this.props.products.filter(product => product.metadata.slug === this.props.match.params.slug)[0];
    this.loadFonts().then(() => console.log("Fonts loaded successfully."));
    this.setState({ product });
  }

  /**
   * Retrieves all 977 fonts from google fonts and formats
   * them to be compatible with the Semantic ui dropdown. It will
   * also load the first 20 respective font families into memory which
   * will be shown initially in the dropdown
   * @returns {Promise<void>}
   */
  async loadFonts() {
    const { items } = await (await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`)).json();
    // Format the fonts to be shown in a <Dropdown /> component
    const formattedFonts = items.map(item => {
      return {
        key: item.family,
        text: item.family,
        value: item.family,
        original: item,
      };
    });

    // Loads the first 20 fonts into memory
    WebFont.load({
      google: {
        families: [...formattedFonts.slice(0, 20).map(i => i.key)] // Basically just take the font family name
      }
    });

    this.setState({ fonts: chunk(formattedFonts, 20), slicedFonts: formattedFonts.slice(0, 20), loadingFonts: false });
  }

  /**
   * When a user scrolls past a certain point the next 20 fonts from
   * the fonts array will be loaded into memory given the starting index. I.e if the starting
   * index for fonts to load is 70 then fonts 70-90 are loaded into memory and set in the state
   * as sliced fonts
   * @param index Number the index to start slicing fonts from in increments of 20
   */
  loadNextFonts(index) {
    const { fonts, slicedFonts } = this.state;
    // Take the previously sliced fonts and concat it with the newly sliced fonts so they will appear in the list after the old fonts
    // We only need to load the new fonts though
    if(!isUndefined(fonts[index])) {
      const newFonts = fonts[index];
      console.log("Loading new fonts: ", newFonts.map(font => font.value));
      WebFont.load({
        google: {
          families: [...newFonts.map(font => font.value)]
        }
      });

      this.setState({slicedFonts: [...slicedFonts, ...newFonts]});
    } else {
      console.log("No more fonts to load");
    }
  }

  /**
   * Finds an SKU given an attribute and a value
   * @param attribute String an attribute like size, color, or material
   * @param data String the attributes data like small, red, or cotton
   */
  onSelectChange(attribute, data) {
      this.setState((prevState) => {
        const { skuMeta, product } = prevState;

        let values = Object.values(skuMeta);
        let keys = Object.keys(skuMeta);
        // Before we add the attribute to the list we must check for duplicate values remove them
        keys.forEach((name, index) => {
          if(name === attribute) {
            // Remove the value in attribute values array at this index
            values.splice(index, 1);
            keys.splice(index, 1);
          }
        });

        const attributeNames = [...keys, attribute];
        const attributeValues = [...values, data.value];

        const sku = getSKU(product.skus, attributeNames, attributeValues);
        if(sku !== null) {
          // If its a color attribute also update the selected color prop in state
          // else it was just a normal dropdown being selected so no need to update the color prop
          if(attribute.toUpperCase().includes("COLOR")) {
            return {
              sku,
              selectedColor: data.value,
              skuMeta: {
                ...prevState.skuMeta,
                [attribute]: data.value
              }
            }
          }
          return {
            sku,
            skuMeta: {
              ...prevState.skuMeta,
              [attribute]: data.value
            }
          }
        } else {
          return {
            showErrorMessage: true,
          }
        }
      });
  }


  /**
   * Returns a list of images to the carousel based on if an
   * SKU is selected or not
   * @returns {{thumbnail: *, original: *}[]|*[]}
   */
  getImages() {
    const baseProductImages = this.state.product.images.map(image => ({ original: image, thumbnail: image }));
    if(this.state.sku === null)
      return baseProductImages;

    if(this.state.sku.image === null)
      return baseProductImages;

    // Return a combination of base product images + the actual skus image but ensure
    // the sku image is the first one in the list and is actively visible to the customer
    return [{ original: this.state.sku.image, thumbnail: this.state.sku.image }, ...baseProductImages];
  }

  addToCart() {
    // Update redux state with the new items in the cart
    this.props.addToCart(this.state.skuMeta.quantity, this.state.product, this.state.sku, this.state.personalMessage, this.state.selectedFont);

    // Show the modal
    this.setState({ open: true })

  }

  render() {
      if(this.state.product === null) {
        return null;
      }

      return (
          <div>
            <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={this.state.showErrorMessage}
                autoHideDuration={6000}
                onClose={() => this.setState({ showErrorMessage: false })}
            >
              <SnackbarContent
                  message={
                    <span>
                     <Icon name="warning" />
                     Could not locate an SKU matching search criteria
                    </span>
                  }
                  action={<Icon name="cancel" onClick={() => this.setState({ showErrorMessage: false })} />}
              />
            </Snackbar>
            <Modal dimmer="blurring" size="small" open={this.state.open} onClose={() => this.setState({ open: false })}>
              <Modal.Header>Added To Your Cart</Modal.Header>
              <Modal.Content image>
                <Image
                    wrapped
                    size='medium'
                    src={this.state.product.images[0]}
                />
                <Modal.Description>
                  <h2>{this.state.product.name}</h2>
                  {
                    this.state.sku !== null &&
                    <AttributeLabel
                        colorStyle={{
                          float: 'none',
                          margin: 0,
                          height: 20,
                          paddingTop: 15,
                          display: 'inline-block'
                        }}
                        attributes={this.state.sku.attributes}
                    />
                  }
                  {
                    this.state.product.metadata.personalizable === "true" &&
                     <List>
                       <List.Item>
                         <Label horizontal>
                           Personal Message
                         </Label>
                         {this.state.personalMessage}
                       </List.Item>
                       <List.Item>
                         <Label horizontal>
                           Font
                         </Label>
                         <span style={{ fontFamily: this.state.selectedFont }}>{this.state.selectedFont}</span>
                       </List.Item>
                     </List>
                  }
                  <hr />
                  <div className="d-flex">
                    <span className="mr-auto">Cart</span>
                    <span>{this.props.cart.items.length} item{ this.props.cart.items.length > 1 ? 's' : ''}</span>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <span className="mr-auto">Subtotal</span>
                    <span>${this.props.cart.subtotal}</span>
                  </div>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ open: false })}>
                  Close
                </Button>
                <Link to="/checkout" className="btn btn-primary">
                  View Cart
                </Link>
              </Modal.Actions>
            </Modal>
            <div className="row my-3">
              <div className="col-md-6 offset-md-2 pl-2" ref={this.galleryRef}>
                <Sticky context={this.galleryRef}>
                <ImageGallery
                    showPlayButton={false}
                    items={this.getImages()}
                />
                <hr />
                </Sticky>
              </div>
              <div className="col-md-3" style={{ marginRight: 30 }}>
                <Card className="bg-light-blue">
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
                        if(attribute.toUpperCase().includes("COLOR"))
                          return (
                              <div key={id}>
                                <span>Color</span>
                                <div className="py-3">
                                  <CirclePicker
                                      color={this.state.selectedColor}
                                      onChangeComplete={(color) => this.onSelectChange(attribute, { value: color.hex })}
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
                                    placeholder={`Select a ${format(attribute)}`} options={attributeValues.options}
                                />
                              </div>
                            </div>
                        )
                      })
                    }
                    {
                      this.state.product.metadata.personalizable === "true" &&
                          <div className="d-flex flex-column">
                            <span>Personalization</span>
                            <span className="text-muted-small">
                                Please include capital letters and punctuation.
                            </span>
                            <Input onChange={(e) => this.setState({ personalMessage: e.target.value, charsRemaining: 40 - e.target.value.length }) } className="mt-2" name="personalization" maxLength={40} />
                            <span className="text-muted-small mb-2">
                              { this.state.charsRemaining } characters remaining
                            </span>
                            <span>Font</span>
                            <Dropdown
                                className="selection my-3"
                                text={this.state.selectedFont}
                                loading={this.state.loadingFonts}
                                options={[]}
                                onScroll={({ target }) => {
                                  // Load more fonts when we have scrolled past 80% of available fonts to look at
                                  if(target.scrollTop >= ((target.scrollHeight - 200) * .80)) {
                                    this.loadNextFonts(this.state.currentFontIndex + 1);
                                    this.setState((prev) => ({ currentFontIndex: prev.currentFontIndex + 1 }));
                                  }
                                }}
                            >
                              <Dropdown.Menu scrolling>
                                {
                                  this.state.slicedFonts.map((option) => (
                                    <Dropdown.Item key={option.value} style={{ fontFamily: option.value }} onClick={() => this.setState({ selectedFont: option.value })}>
                                      {option.value}
                                    </Dropdown.Item>
                                  ))
                                }
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
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
                      <Button primary onClick={() => this.addToCart()} className="mb-2" disabled={this.state.product.attributes.length + 1 !== Object.keys(this.state.skuMeta).length}>
                        Add to Cart
                      </Button>
                      <Responsive maxWidth={767}>
                        <Button as={Link} to="/checkout" primary style={{ minWidth: '100%'}}>
                          Checkout
                        </Button>
                      </Responsive>
                      <span className="text-muted-small">
                          Tax and shipping will be calculated at checkout.
                      </span>
                    </div>
                  </Card.Content>
                </Card>

                <Card className="bg-light-blue">
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
