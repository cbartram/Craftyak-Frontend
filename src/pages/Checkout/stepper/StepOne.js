import React from 'react';
import AttributeLabel from "../../../components/AttributeLabel/AttributeLabel";
import { Button, List, Dropdown, Header, Image, Menu } from "semantic-ui-react";
import times from "lodash/times";

/**
 * Handles step one of the stepper for the checkout
 * page showing a list of product the user purchased
 * @param props
 * @returns {*}
 * @constructor
 */
export const StepOne = (props) => {
    return (
        <div>
            <Header as="h2" className="header-muted">{ props.header }</Header>
            {
                props.items.map(product => {
                    return (
                        <Menu key={product.id}>
                            <Menu.Item position="left">
                                <Image src={product.images[0]} heigh={60} width={60}/>
                            </Menu.Item>
                            <Menu.Item position="left">
                                {product.name}
                            </Menu.Item>
                            <Menu.Item>
                                ${(product.price / 100).toFixed(2)}
                            </Menu.Item>
                            <Menu.Item position="right">
                                <div className="d-flex flex-column">
                                    {
                                        props.mutable ?
                                            <div>
                                                <Dropdown
                                                    className="mt-2"
                                                    placeholder="1"
                                                    compact
                                                    selection
                                                    value={product.quantity}
                                                    onChange={(e, data) => props.onUpdateQuantity(product.id, data.value)}
                                                    options={
                                                        times(10, (index) => ({
                                                            key: index + 1,
                                                            text: index + 1,
                                                            value: index + 1,
                                                        }))}
                                                />
                                                <Button className="button-link button-link-danger" onClick={() => props.onRemove(product.id)}>
                                                    Remove
                                                </Button>
                                            </div> :
                                            product.quantity

                                    }
                                </div>
                            </Menu.Item>
                            <Menu.Item>
                                <AttributeLabel attributes={product.attributes} />
                            </Menu.Item>
                        </Menu>
                    )
                })
            }
        </div>
    )
};
