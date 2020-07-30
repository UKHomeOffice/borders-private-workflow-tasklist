import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../core/shift/actions';
import './DashboardTitle.css';
import AppConstants from '../../../common/AppConstants';
import secureLocalStorage from '../../../common/security/SecureLocalStorage';
import { endingShift, hasActiveShift } from '../../../core/shift/selectors';

class DashboardTitle extends React.Component {
  constructor(props) {
    super(props);
    this.endShift = this.endShift.bind(this);
    this.viewShift = this.viewShift.bind(this);
    this.secureLocalStorage = secureLocalStorage;
  }

  componentDidUpdate() {
    const { hasActiveShift } = this.props;
    if (!hasActiveShift) {
      window.location.reload();
    }
  }

  endShift(e) {
    e.preventDefault();
    this.secureLocalStorage.remove('shift');
    this.props.endShift();
  }

  viewShift(e) {
    e.preventDefault();
    const { history } = this.props;
    history.replace(AppConstants.SHIFT_PATH);
  }

  render() {
    const { endingShift, hasActiveShift, kc } = this.props;
    
    return (
      <div className="dashboard" id="dashboardTitle">
        <div className="govuk-width-container">
          <div className="govuk-grid-row dashboard__flex-container">
            <div className="dashboard__title">
              <h1 className="dashboard__text govuk-heading-xl">Welcome to the Central Operations Platform</h1>
            </div>

            {hasActiveShift && (
            <div className="dashboard__info-box">
              <h2 className="dashboard__text govuk-heading-m">My details</h2>
              <ul className="dashboard__text govuk-list">
                <li>
                  <span className="dashboard_text-heading">Name</span>
                  <span>{kc.tokenParsed.given_name} {kc.tokenParsed.family_name}</span>
                </li>
              </ul>
              <button
                id="editShift"
                className="govuk-button govuk-button--secondaryy dashboard__shift-button"
                type="submit"
                onClick={this.viewShift}
                disabled={endingShift}
              >Edit shift
              </button>
              <button
                id="endShift"
                className="govuk-button govuk-button--warning dashboard__shift-button"
                data-module="govuk-button"
                type="submit"
                onClick={this.endShift}
                disabled={endingShift}
                data-prevent-double-click="true"
              >End shift
              </button>
            </div>
          )}
            {!hasActiveShift && (
            <button id="startShift" className="govuk-button" type="submit" onClick={this.viewShift}>Start shift</button>
          )}
          </div>
        </div>
      </div>
    )
  }
}


DashboardTitle.propTypes = {
  endShift: PropTypes.func.isRequired,
  kc: PropTypes.shape({ logout: PropTypes.func }).isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => {
  return {
    kc: state.keycloak,
    hasActiveShift: hasActiveShift(state),
    endingShift: endingShift(state),
  };
}, mapDispatchToProps)(DashboardTitle));
