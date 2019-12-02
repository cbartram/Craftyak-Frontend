import React from 'react';
import {Label, List} from "semantic-ui-react";


/**
 * Shows a list of attributes for a specific SKU
 * @param props
 * @constructor
 */
const AttributeLabel = (props) => {
    return <List>
        {
            Object.keys(props.attributes).map((key, i) => {
                if (key.includes("color")) {
                    return (
                        <List.Item key={i}>
                            <Label horizontal>
                                {key}
                            </Label>
                            <div className="color-tile" style={{background: props.attributes[key], ...props.colorStyle}}/>
                        </List.Item>
                    )
                }
                return (
                    <List.Item key={i}>
                        <Label horizontal>
                            {key}
                        </Label>
                        {props.attributes[key]}
                    </List.Item>
                )
            })
        }
    </List>
};

export default AttributeLabel;
