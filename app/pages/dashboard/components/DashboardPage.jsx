import React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DashboardTitle from './DashboardTitle';
import DashboardPanel from './DashboardPanel';
import * as actions from '../../../core/shift/actions';
import * as errorActions from '../../../core/error/actions';

export class DashboardPage extends React.Component {

    render() {
        return (
          <div id="dashboardContent">
            <DashboardTitle {...this.props} />
            <DashboardPanel {...this.props} />
          </div>
)

    }
}

DashboardPage.propTypes = {
    shift: ImmutablePropTypes.map
};


const mapDispatchToProps = dispatch => bindActionCreators({ ...actions, ...errorActions}, dispatch);

export default withRouter(connect(state => {
    return {
    }
}, mapDispatchToProps)(DashboardPage))
