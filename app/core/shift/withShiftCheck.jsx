import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {Redirect, withRouter} from 'react-router';
import moment from 'moment';
import Immutable from 'immutable';
import {hasActiveShift, isFetchingShift, shift} from './selectors';
import * as actions from './actions';
import ErrorHandlingComponent from '../error/component/ErrorHandlingComponent';
import * as errorActions from '../error/actions';
import DataSpinner from '../components/DataSpinner';
import secureLocalStorage from "../../common/security/SecureLocalStorage";
import AppConstants from "../../common/AppConstants";

const uuidv4 = require('uuid/v4');

export default function (ComposedComponent) {
  class withShiftCheck extends React.Component {
    constructor(props) {
      super(props);
      this.secureLocalStorage = secureLocalStorage;
    }

    componentDidMount() {
      this.props.resetErrors();
      let shiftFromLocalStorage = this.secureLocalStorage.get("shift");
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
      if (this.props.hasActiveShift && this.shiftValid(this.props.shift)) {
        this.secureLocalStorage.set("shift", this.props.shift);
      } else {
        this.secureLocalStorage.remove("shift");
        this.props.history.replace(AppConstants.SHIFT_PATH)
      }
    }

    shiftValid(shift) {
      if (shift) {
        const endDateTime = moment(shift.get('enddatetime'));
        return moment().diff(endDateTime) < 0
      } 
      return false; 
    }

    render() {
      const {hasActiveShift, isFetchingShift} = this.props;
      if (isFetchingShift) {
        return <DataSpinner message="Checking if you have an active shift" />;
      } 
      if (hasActiveShift) {
        return (
          <ErrorHandlingComponent>
            <ComposedComponent
              {...this.props}
              key={uuidv4()}
            />
          </ErrorHandlingComponent>
        );
      } 
      return <Redirect to={AppConstants.SHIFT_PATH} />;  
    }
  }

  withShiftCheck.propTypes = {
    fetchActiveShift: PropTypes.func.isRequired,
    setHasActiveShift: PropTypes.func.isRequired,
    resetErrors: PropTypes.func.isRequired,
    isFetchingShift: PropTypes.bool,
    hasActiveShift: PropTypes.bool
  };

  const mapStateToProps = createStructuredSelector({
    hasActiveShift,
    isFetchingShift,
    shift
  });

  const mapDispatchToProps = dispatch => bindActionCreators({ ...actions, ...errorActions}, dispatch);

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(withShiftCheck));
}

