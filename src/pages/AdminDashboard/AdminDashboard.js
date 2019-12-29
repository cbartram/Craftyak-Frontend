import React, { Component } from 'react';
import ReactTable from 'react-table'
import uniqBy from 'lodash/uniqBy';
import { Link } from "react-router-dom";
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import withContainer from "../../components/withContainer";
import { getOrders, updateOrders } from "../../actions/actions";
import {
    SUB_TABLE_COLUMNS
} from "../../constants";
import 'react-table/react-table.css'
import './AdminDashboard.css';

const mapStateToProps = state => ({
   admin: state.admin,
});

const mapDispatchToProps = dispatch => ({
    getOrders: () => dispatch(getOrders()),
    updateOrders: (payload, id) => dispatch(updateOrders(payload, id))
});

class AdminDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            TABLE_COLUMNS: [
                {
                    Header: 'Order Number',
                    accessor: 'id'
                },
                {
                    Header: 'First Name',
                    accessor: 'address.firstName'
                },
                {
                    Header: 'Last Name',
                    accessor: 'address.lastName'
                },
                {
                    Header: 'Status',
                    accessor: 'status'
                },
                // {
                //     Header: 'Shipment ID',
                //     accessor: 'shipmentId'
                // },
                // {
                //     Header: 'Checkout ID',
                //     accessor: 'stripeCheckoutSessionId'
                // },
                {
                    Header: 'Street',
                    accessor: 'address.street'
                },
                {
                    Header: 'Unit Number',
                    accessor: 'address.unitNumber'
                },
                {
                    Header: 'City',
                    accessor: 'address.city'
                },
                {
                    Header: 'State',
                    accessor: 'address.state'
                },
                {
                    Header: 'Postal Code',
                    accessor: 'address.zip'
                },
                {
                    Header: 'Print Label',
                    Cell: ({ row }) =>
                        <Link
                            to={row._original.shippingLabelUrl}
                            rel='noopener noreferrer'
                            onClick={e => {e.preventDefault(); window.open(row._original.shippingLabelUrl)}}
                            target="_blank">
                            Shipping Label
                        </Link>,
                },
                {
                    Header: 'Mark Shipped',
                    Cell: ({ row }) => <Button loading={this.props.admin.isFetching} primary onClick={() => this.markShipped(row._original)}>Mark Shipped</Button>,
                }
            ]
        }
    }
    componentDidMount() {
        this.props.getOrders();
    }

    markShipped(row) {
        console.log("Marking Shipped: ", row);
        this.props.updateOrders({ status: "shipped" }, row.id)
    }

    /**
     * Converts a simple object in the format { attributes: { a: b ... } } into the correct structure
     * for a ReactTable column.
     * i.e an object with 3 keys would produce [{ Column: key, accessor: attributes.key }, ...] etc.
     * @param skus Array of objects for skus each with a map property named "attributes"
     */
    formatTableColumns(skus) {
        const arr = [];
        arr.push({
            Header: 'Personalizable',
            accessor: 'personalizable',
            Cell: ({ row }) => row.personalizable ? 'True' : 'False'
        });

        arr.push({
            Header: 'Personal Message',
            accessor: 'personalMessage'
        });

        arr.push({
            Header: 'Font',
            accessor: 'font',
        });

        skus.forEach(sku => {
            console.log("Sku being processed: ", sku);
            Object.keys(sku.attributes).forEach(attributeKey => arr.push({Header: attributeKey, accessor: `attributes.${attributeKey}`}));
        });


        return uniqBy(arr, 'Header');
    }

    render() {
        return (
            <div className="row px-3">
                <div className="col-md-12 my-3">
                    <ReactTable
                        data={this.props.admin.orders}
                        loading={this.props.admin.isFetching}
                        loadingText="Loading Orders..."
                        columns={this.state.TABLE_COLUMNS}
                        minRows={5}
                        SubComponent={row => {
                            return (
                                <div className="well p-3">
                                    <ReactTable
                                        data={row.original.skus}
                                        loading={this.props.admin.isFetching}
                                        loadingText="Loading Orders"
                                        minRows={3}
                                        columns={[...SUB_TABLE_COLUMNS, ...this.formatTableColumns(row.original.skus)]}
                                />
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(AdminDashboard));
