import React from 'react';
import { withRouter } from 'react-router';
import DashboardTitle from './DashboardTitle';
import DashboardPanel from './DashboardPanel';
import { bindActionCreators } from 'redux';
import * as actions from '../../../core/shift/actions';
import { connect } from 'react-redux';
import * as errorActions from '../../../core/error/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import "./Dashboard.scss";

export class DashboardPage extends React.Component {

    render() {
        return <div id="dashboardContent">
            <DashboardTitle {...this.props} />
            <DashboardPanel {...this.props}/>
        </div>

    }
}

DashboardPage.propTypes = {
    shift: ImmutablePropTypes.map
};


const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, actions, errorActions), dispatch);

export default withRouter(connect((state) => {
    return {
    }
}, mapDispatchToProps)(DashboardPage))
