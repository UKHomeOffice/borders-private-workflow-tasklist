import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Loader from 'react-loader-advanced';
import {
    activeShiftSuccess,
    isFetchingShift,
    loadingShiftForm,
    shift,
    shiftForm,
    submittingActiveShift,
} from '../../../core/shift/selectors';
import * as actions from '../../../core/shift/actions';
import DataSpinner from '../../../core/components/DataSpinner';
import ShiftForm from './ShiftForm';
import secureLocalStorage from "../../../common/security/SecureLocalStorage";
import AppConstants from '../../../common/AppConstants';

export class ShiftPage extends React.Component {
  constructor(props) {
      super(props);
      this.secureLocalStorage = secureLocalStorage;
    }

  componentDidMount() {
      const { shift } = this.props;
      document.title = `${shift ? 'Edit shift' : 'Start shift'} | ${AppConstants.APP_NAME}`;
      this.props.fetchActiveShift();
      this.props.fetchShiftForm();
    }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.submittingActiveShift !== prevProps.submittingActiveShift && !this.props.submittingActiveShift) {
          if (this.form && this.form.formio) {
              if (this.props.activeShiftSuccess) {
                  this.secureLocalStorage.set(`shift::${this.props.kc.tokenParsed.email}`, this.props.shift);
                  this.form.formio.emit('submitDone');
                  this.props.history.replace('/dashboard');
                } else {
                  this.form.formio.emit('error');
                  this.form.formio.emit('change', this.form.formio.submission);
                }
            }
        }
    }

  render() {
      const {
        isFetchingShift,
        submittingActiveShift,
        loadingShiftForm,
        shiftForm,
      } = this.props;

      if (loadingShiftForm && isFetchingShift) {
          return <DataSpinner message="Loading your shift details" />;
        }

      if (!shiftForm) {
          return <DataSpinner message="Getting shift form" />;
        }
      const spinner = <DataSpinner message="Submitting your shift details..." />;
      return (
        <Loader
          show={submittingActiveShift}
          message={spinner}
          hideContentOnLoad={submittingActiveShift}
          foregroundStyle={{color: 'black'}}
          backgroundStyle={{backgroundColor: 'white'}}
        >
          <div className="govuk-grid-row" style={{padding: '10px 10px'}}>
            <div className="govuk-grid-row-column-full" id="shiftWizardForm">
              <ShiftForm
                {...this.props}
                formReference={form => this.form = form}
                submit={(shiftForm, submission) => {
                                       this.props.submit(shiftForm.id, submission.data);
                                   }}
              />
            </div>
          </div>
        </Loader>
);
    }

}

ShiftPage.propTypes = {
  fetchShiftForm: PropTypes.func.isRequired,
  fetchActiveShift: PropTypes.func.isRequired,
  isFetchingShift: PropTypes.bool,
  kc: PropTypes.shape({
    tokenParsed: PropTypes.shape({
      email: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  shift: ImmutablePropTypes.map,
  unauthorised: PropTypes.bool,
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => ({
        isFetchingShift: isFetchingShift(state),
        submittingActiveShift: submittingActiveShift(state),
        activeShiftSuccess: activeShiftSuccess(state),
        shift: shift(state),
        shiftForm: shiftForm(state),
        loadingShiftForm: loadingShiftForm(state),
        kc: state.keycloak,
        appConfig: state.appConfig,
    }), mapDispatchToProps)(ShiftPage));
