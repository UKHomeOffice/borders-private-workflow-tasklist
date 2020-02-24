import React from 'react';
import { withRouter } from 'react-router';
import AppConstants from '../../../common/AppConstants';
import DashboardTitle from './DashboardTitle';
import DashboardPanel from './DashboardPanel';
import { bindActionCreators } from 'redux';
import * as actions from '../../../core/shift/actions';
import { connect } from 'react-redux';
import * as errorActions from '../../../core/error/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import "./Dashboard.scss";

export class DashboardPage extends React.Component {

    componentDidMount() {
        document.title = `Operational dashboard | ${AppConstants.APP_NAME}`;
    }

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
