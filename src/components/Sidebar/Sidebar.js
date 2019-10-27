import React, { Component } from 'react';
import './Sidebar.css';
import { Icon } from "semantic-ui-react";

export default class Sidebar extends Component {
  render() {
      return (
          <div className="col-md-2 d-none d-md-block bg-light sidebar pl-0">
            <div className="sidebar-sticky">
              <div className="nav flex-column" style={this.props.sticky ? { position: 'fixed', top: '85px'  } : { position: 'relative'} }>
                <div className="d-flex flex-row justify-content-start ml-4">
                  <Icon name="list" />
                  <p>Filter</p>
                </div>
                <div className="accordion" id="accordionExample">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h2 className="mb-0">
                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                          Product Type
                        </button>
                      </h2>
                    </div>

                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                      <div className="card-body">

                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="headingTwo">
                      <h2 className="mb-0">
                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          Price
                        </button>
                      </h2>
                    </div>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                      <div className="card-body">

                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="headingThree">
                      <h2 className="mb-0">
                        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          Material
                        </button>
                      </h2>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                      <div className="card-body">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )
  }
}
