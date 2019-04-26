import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hasActiveShift, isFetchingShift, shift } from './selectors';
import * as actions from './actions';
import { createStructuredSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router';
import ErrorHandlingComponent from '../error/component/ErrorHandlingComponent';
import * as errorActions from '../error/actions';
import DataSpinner from '../components/DataSpinner';

const uuidv4 = require('uuid/v4');

export default function (ComposedComponent) {
  class withShiftCheck extends React.Component {

    componentWillMount() {
      this.props.resetErrors();
      if (!this.props.location.state || !this.props.location.state.shiftPresent) {
        this.props.fetchActiveShift();
      } else {
        if (this.props.location.state.shiftPresent) {
          this.props.setHasActiveShift();
        }
      }
    }

    render() {
      const { hasActiveShift, isFetchingShift } = this.props;

      if (isFetchingShift) {
        return <DataSpinner message={`Checking if you have an active shift`}/>;
      } else {
        if (hasActiveShift) {
          return <ErrorHandlingComponent><BackButton {...this.props}><ComposedComponent {...this.props}
                                                                                        key={uuidv4()}/></BackButton></ErrorHandlingComponent>;
        } else {
          return <Redirect to="/shift"/>;
        }
      }
    }

  }

  class BackButton extends React.Component {
    render() {
      if (this.props.location.pathname !== '/dashboard') {
        const pointerStyle = { cursor: 'pointer', paddingTop: '10px', textDecoration: 'underline', display: 'inline-block' };
        return <div>
          <div style={pointerStyle} onClick={() => this.props.history.replace('/dashboard')}>Back to
            dashboard
          </div>
          {this.props.children}
        </div>;
      }
      return <div>{this.props.children}</div>;
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
    hasActiveShift: hasActiveShift,
    isFetchingShift: isFetchingShift,
    shift: shift
  });

  const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, actions, errorActions), dispatch);

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(withShiftCheck));
}

