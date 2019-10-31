import React from 'react';
import {Button, Dropdown, Header, Image, Menu} from "semantic-ui-react";
import times from "lodash/times";

export const StepOne = (props) => {
    return (
        <div>
        <Header as="h2" className="header-muted">Your Cart</Header>
    {
        props.items.map(product => {
            return (
                <Menu key={product.uuid}>
                    <Menu.Item position="left">
                        <Image src={product.heroImage} heigh={60} width={60}/>
                    </Menu.Item>
                    <Menu.Item position="left">
                        {product.name}
                    </Menu.Item>
                    <Menu.Item>
                        ${product.price}
                    </Menu.Item>
                    <Menu.Item position="right">
                        <div className="d-flex flex-column">
                            <Dropdown
                                className="mt-2"
                                placeholder="1"
                                compact
                                selection
                                value={product.quantity}
                                onChange={(e, data) => props.onUpdateQuantity(product.uuid, data.value)}
                                options={
                                    times(10, (index) => ({
                                        key: index + 1,
                                        text: index + 1,
                                        value: index + 1,
                                    }))}
                            />
                            <Button className="button-link button-link-danger"
                                    onClick={() => props.onRemove(product.uuid)}>Remove</Button>
                        </div>
                    </Menu.Item>
                </Menu>
            )
        })
    }
        </div>
    )
};
