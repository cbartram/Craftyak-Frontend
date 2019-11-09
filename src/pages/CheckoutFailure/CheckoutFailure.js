import React, { Component } from 'react';
import withContainer from "../../components/withContainer";
import './CheckoutFailure.css';
import { Header,} from "semantic-ui-react";

const CheckoutFailure = (props) => {
    return (
        <div>
          <div className="row page-bg-gray">
            <div className="col-md-5 ml-auto mr-auto">
              <div className="my-4">
                <Header as="h2" className="header-muted">Oh no!</Header>
                <p className="common-body-text">There was an issue with the checkout process. You have <b>not been charged.</b> Feel free
                to keep browsing the store and try again!</p>
              </div>
            </div>
          </div>
        </div>
    )
};

export default withContainer(CheckoutFailure);
