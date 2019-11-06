import React, {Component} from 'react';
import {
    Form,
    Select
} from "semantic-ui-react";
import {optionify} from "../../../util";
import statesJson from '../../../data/states';
const states = optionify(Object.values(statesJson));

export default class StepTwo extends Component {
    render() {
        return (
            <div>
                <h2>Shipping Details</h2>
                <Form>
                    <Form.Field>
                        <label>First Name</label>
                        <input placeholder='First Name' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'firstName')} />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <input placeholder='Last Name' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'lastName')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Street</label>
                        <input placeholder='Street' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'street')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Unit Number</label>
                        <input placeholder='Unit Number' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'unitNumber')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input placeholder='City' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'city')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>State</label>
                        <Select options={states} onChange={(e, data) => this.props.onFieldUpdate(data.value, 'state')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Zip</label>
                        <input placeholder='Zip Code' onChange={(e) => this.props.onFieldUpdate(e.target.value, 'zip')}/>
                    </Form.Field>
                </Form>
            </div>
        )
    }
}
