import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router';
import moment from 'moment';
import Immutable from 'immutable';
import { hasActiveShift, isFetchingShift, shift } from './selectors';
import * as actions from './actions';
import ErrorHandlingComponent from '../error/component/ErrorHandlingComponent';
import * as errorActions from '../error/actions';
import DataSpinner from '../components/DataSpinner';
import secureLocalStorage from '../../common/security/SecureLocalStorage';
import AppConstants from '../../common/AppConstants';

const uuidv4 = require('uuid/v4');

export default function (ComposedComponent) {
  class withShiftCheck extends React.Component {
    constructor(props) {
      super(props);
      this.secureLocalStorage = secureLocalStorage;
    }

    componentDidMount() {
      this.props.resetErrors();
      let shiftFromLocalStorage = this.secureLocalStorage.get(`shift::${this.props.kc.tokenParsed.email}`);
      if (!shiftFromLocalStorage) {
        this.props.fetchActiveShift();
      }
      shiftFromLocalStorage = Immutable.fromJS(shiftFromLocalStorage);
      if (shiftFromLocalStorage && this.shiftValid(shiftFromLocalStorage)) {
        this.props.setHasActiveShift(true);
      } else {
        this.props.setHasActiveShift(false);
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (!isFetchingShift) {
        if (this.props.hasActiveShift && this.shiftValid(this.props.shift)) {
          this.secureLocalStorage.set(`shift::${this.props.kc.tokenParsed.email}`, this.props.shift);
        } else {
          this.secureLocalStorage.remove(`shift::${this.props.kc.tokenParsed.email}`);
          this.props.history.replace(AppConstants.SHIFT_PATH);
        }
      }
    }

    shiftValid(shift) {
      if (shift) {
        const endDateTime = moment(shift.get('enddatetime'));
        return moment().diff(endDateTime) < 0;
      }
      return false;
    }

    render() {
      const { hasActiveShift, isFetchingShift } = this.props;
      if (isFetchingShift) {
        return <DataSpinner message="Checking if you have an active shift" />;
      }
      if (hasActiveShift) {
        return (
          <ErrorHandlingComponent>
            <BackButton {...this.props}>
              <ComposedComponent {...this.props} key={uuidv4()} />
            </BackButton>
          </ErrorHandlingComponent>
        );
      }
      return <Redirect to={AppConstants.SHIFT_PATH} />;
    }
  }

  class BackButton extends React.Component {
    render() {
      if (this.props.location.pathname !== AppConstants.DASHBOARD_PATH) {
        return (
          <React.Fragment>
            <a
              href={AppConstants.DASHBOARD_PATH}
              style={{ textDecoration: 'none' }}
              className="govuk-back-link govuk-!-font-size-19"
              onClick={event => {
                event.preventDefault();
                this.props.history.replace(AppConstants.DASHBOARD_PATH);
              }}
            >
              Back to dashboard
            </a>
            {this.props.children}
          </React.Fragment>
        );
      }
      return <React.Fragment>{this.props.children}</React.Fragment>;
    }
  }

  withShiftCheck.propTypes = {
    fetchActiveShift: PropTypes.func.isRequired,
    setHasActiveShift: PropTypes.func.isRequired,
    resetErrors: PropTypes.func.isRequired,
    isFetchingShift: PropTypes.bool,
    kc: PropTypes.shape({
      tokenParsed: PropTypes.shape({
        email: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    hasActiveShift: PropTypes.bool,
  };

  const mapStateToProps = createStructuredSelector({
    hasActiveShift,
    isFetchingShift,
    kc: state => state.keycloak,
    shift,
  });

  const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...actions, ...errorActions }, dispatch);

  return withRouter(
    connect(mapStateToProps, mapDispatchToProps)(withShiftCheck),
  );
}
