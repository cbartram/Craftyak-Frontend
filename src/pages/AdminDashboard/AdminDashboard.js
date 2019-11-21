import React, { Component } from 'react';
import ReactTable from 'react-table'
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import withContainer from "../../components/withContainer";
import { getOrders } from "../../actions/actions";
import {
    SUB_TABLE_COLUMNS
} from "../../constants";
import 'react-table/react-table.css'
import './AdminDashboard.css';

const mapStateToProps = state => ({
   admin: state.admin,
});

const mapDispatchToProps = dispatch => ({
    getOrders: () => dispatch(getOrders())
});

// React Table
export const TABLE_COLUMNS = [
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
        Cell: ({ row }) => <Button primary onClick={() => AdminDashboard.printShippingLabel(row.original)}>Shipping Label</Button>,
    },
    {
        Header: 'Mark Shipped',
        Cell: ({ row }) => <Button primary onClick={() => AdminDashboard.markShipped(row.original)}>Mark Shipped</Button>,
    }
];

class AdminDashboard extends Component {
    componentDidMount() {
        this.props.getOrders();
    }

    static printShippingLabel(row) {
        console.log("Printing Shipping Label: ", row);
        console.log(this);
    }

    static markShipped(row) {
        console.log("Marking Shipped: ", row);
        console.log(this);
    }

    render() {
        return (
            <div className="row px-3">
                <div className="col-md-12 my-3">
                    <ReactTable
                        data={this.props.admin.orders}
                        loading={this.props.admin.isFetching}
                        loadingText="Loading Orders..."
                        columns={TABLE_COLUMNS}
                        minRows={5}
                        SubComponent={row => {
                            return (
                                <div className="well p-3">
                                    <ReactTable
                                        data={row.original.skus}
                                        loading={this.props.admin.isFetching}
                                        loadingText="Loading Orders"
                                        minRows={3}
                                        columns={SUB_TABLE_COLUMNS}
                                        defaultPageSize={3}
                                        showPagination={false}
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
