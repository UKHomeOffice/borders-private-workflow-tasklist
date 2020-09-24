import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import PubSub from 'pubsub-js';
import * as actions from './actions';
import * as logActions from '../error/actions';

import DataSpinner from '../components/DataSpinner';
import {
  isCheckingOnBoarding,
  isFetchingStaffDetails,
  isFetchingStaffId,
  staffDetails,
} from './selectors';
import OnboardChecker from './OnboardChecker';

export default function (ComposedComponent) {
  class withOnboardingCheck extends React.Component {
    static propTypes = {};

    componentDidMount() {
      this.props.performOnboardingCheck();
      this.props.fetchStaffDetails();
      this.props.fetchStaffId();
    }

    componentDidUpdate(prevProps) {
      const path = this.props.history.location.pathname;
      const user = this.props.kc.tokenParsed.email;
      if (
        prevProps.isFetchingStaffId !==
          this.props.isFetchingStaffId &&
        !this.props.isFetchingStaffId
      ) {
        const { staffDetails } = this.props;
        let { redirectPath, data } = OnboardChecker.onBoardCheck(
          staffDetails,
          this.props.location.pathname,
        );

        if (path === '/onboard-user' && redirectPath === '/onboard-user') {
          redirectPath = null;
        }

        if (redirectPath) {
          if (data) {
            PubSub.publish('submission', data);
          }
          this.props.log([
            {
              user,
              path,
              message: `${user} being redirected to ${redirectPath}`,
              level: 'debug',
              data,
            },
          ]);
          this.props.history.replace(redirectPath);
        } else {
          this.props.onboardingCheckCompete();
        }
      }
    }

    render() {
      const { isCheckingOnBoarding } = this.props;

      if (isCheckingOnBoarding) {
        return <DataSpinner message="Checking your credentials" />;
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  withOnboardingCheck.propTypes = {
    log: PropTypes.func,
    fetchStaffDetails: PropTypes.func.isRequired,
    fetchStaffId: PropTypes.func.isRequired,
    performOnboardingCheck: PropTypes.func.isRequired,
    onboardingCheckCompete: PropTypes.func.isRequired,
    isCheckingOnBoarding: PropTypes.bool,
    isFetchingStaffDetails: PropTypes.bool,
  };

  const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign(actions, logActions), dispatch);

  return withRouter(
    connect(
      state => ({
        staffDetails: staffDetails(state),
        isFetchingStaffDetails: isFetchingStaffDetails(state),
        isFetchingStaffId: isFetchingStaffId(state),
        isCheckingOnBoarding: isCheckingOnBoarding(state),
        kc: state.keycloak,
      }),
      mapDispatchToProps,
    )(withOnboardingCheck),
  );
}
