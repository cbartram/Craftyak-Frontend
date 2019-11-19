import React, { Component } from 'react';
import withContainer from "../../components/withContainer";
import './AdminDashboard.css';

class AdminDashboard extends Component {
    render() {
        return <h1>Admin Dashboard Page</h1>
    }
}

export default withContainer(AdminDashboard);
