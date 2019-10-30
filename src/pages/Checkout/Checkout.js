import React, { Component } from "react";
import {
    Header,
    Card
} from "semantic-ui-react";
import withContainer from "../../components/withContainer";
import './Checkout.css';

/**
 * A functional component which is shown when the rout returns a 404
 * @returns {*}
 */
class Checkout extends Component {
    render() {
        return (
            <div>
                <Header as='h1'>Shopping Cart</Header>
                <div className="row">
                    <Card>
                    <Card.Content>
                        <Card.Header>Matthew Harris</Card.Header>
                        <Card.Meta>Co-Worker</Card.Meta>
                        <Card.Description>
                            Matthew is a pianist living in Nashville.
                        </Card.Description>
                    </Card.Content>
                </Card>
                </div>
            </div>
        )
    }
}

export default withContainer(Checkout);
