import React from 'react';
import {
    Form,
    Select
} from "semantic-ui-react";
import {optionify} from "../../../util";
import statesJson from '../../../data/states';
const states = optionify(Object.values(statesJson));

export const StepTwo = (props) => {
        return (
            <div>
                <h2>Shipping Details</h2>
                <Form>
                    <Form.Field>
                        <label>First Name</label>
                        <Form.Input
                            placeholder='First Name'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'firstName')}
                            error={props.errors['firstName']}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <Form.Input
                            placeholder='Last Name'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'lastName')}
                            error={props.errors['lastName']}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Street</label>
                        <Form.Input
                            placeholder='Street'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'street')}
                            error={props.errors['street']}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Unit Number</label>
                        <Form.Input
                            placeholder='Unit Number'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'unitNumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <Form.Input
                            placeholder='City'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'city')}
                            error={props.errors['city']}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>State</label>
                        <Select
                            options={states}
                            onChange={(e, data) => props.onFieldUpdate(data.value, 'state')}
                            error={props.errors['state']}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Zip</label>
                        <Form.Input
                            placeholder='Zip Code'
                            onChange={(e) => props.onFieldUpdate(e.target.value, 'zip')}
                            error={props.errors['zip']}
                        />
                    </Form.Field>
                </Form>
            </div>
        );
};
