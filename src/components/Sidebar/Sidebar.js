import React, { Component } from 'react';
import { Slider } from "react-semantic-ui-range";
import {Form, Icon} from "semantic-ui-react";
import './Sidebar.css';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [0, 100],
      checkbox: {
        mug: false,
        cup: false,
        sticker: false,
        shirt: false,
      }
    }
  }

  /**
   * Handles a checkbox being selected and filters the products
   * accordingly
   * @param value String value of the checkbox being selected
   */
  onCheck(value) {
    this.setState((prevState) => ({
      checkbox: {
        ...this.state.checkbox,
        [value]: !prevState.checkbox[value]
      }
    }), () => {
      this.props.onFilter(this.state.checkbox);
    });
  }

  /**
   * Returns the proper JSX for the filter form given a simple
   * form name
   * @param value String the value of the form i.e PRICE or PRODUCT
   */
  getForm(value) {
    if(value === "PRICE") {
      const prices = this.props.products.items.map(item => item.price);
      const settings = {
        start: [0, 100],
        min: Math.min(...prices),
        max: Math.max(...prices),
        step: 1
      };
      return (
          <div>
            <div className="d-flex flex-row">
              <Slider multiple color="red" settings={settings} />
              <div className="d-flex flex-column">
                <span>Min Price</span>
                <span>{this.state.values[0]}</span>
              </div>
              <div className="d-flex flex-column mx-4">
                <span>Max Price</span>
                <span>{this.state.values[1]}</span>
              </div>
            </div>
          </div>
      )
    }

    return (
        <Form>
          <Form.Group grouped>
            <Form.Checkbox label='Mug' value='mug' checked={this.state.checkbox.mug} onClick={(e, data) => this.onCheck(data.value)} />
            <Form.Checkbox label='Cup' value='cup' checked={this.state.checkbox.cup} onClick={(e, data) => this.onCheck(data.value)} />
            <Form.Checkbox label='Sticker' value='sticker' checked={this.state.checkbox.sticker} onClick={(e, data) => this.onCheck(data.value)} />
            <Form.Checkbox label='Shirt' value='shirt' checked={this.state.checkbox.shirt} onClick={(e, data) => this.onCheck(data.value)} />
          </Form.Group>
        </Form>
    )
  }

  render() {
      return (
          <div className="col-md-2 d-none d-md-block sidebar pl-0">
            <div className="sidebar-sticky">
              <div className="nav flex-column" style={this.props.sticky ? { position: 'fixed', top: '85px'  } : { position: 'relative'} }>
                <div className="accordion" id="accordionExample">
                  <div className="ml-2 px-4">
                    <div id="headingOne">
                      <p className="mb-0">
                        <a href="#product-type" className="sidebar-product-type" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Product Type
                        </a>
                      </p>
                    </div>
                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                      <div className="card-body">
                        { this.getForm('PRODUCT') }
                      </div>
                    </div>
                  </div>
                  {/*<div className="ml-2 px-4">*/}
                  {/*  <div id="headingTwo">*/}
                  {/*    <h2 className="mb-0">*/}
                  {/*      <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">*/}
                  {/*        Price*/}
                  {/*      </button>*/}
                  {/*    </h2>*/}
                  {/*  </div>*/}
                  {/*  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">*/}
                  {/*    <div className="card-body">*/}
                  {/*      /!*{ this.getForm('PRICE') }*!/*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </div>
      )
  }
}
