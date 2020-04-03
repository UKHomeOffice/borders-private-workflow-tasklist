import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {  withRouter } from 'react-router';
import PubSub from 'pubsub-js';
import ErrorPanel from './ErrorPanel';
import * as actions from '../actions';
import { errors, hasError, unauthorised } from '../selectors';
import FormErrorPanel from './FormErrorPanel';

export class ErrorHandlingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formErrors: []
    }
  }

  componentDidMount() {
    this.formSubmissionError = PubSub.subscribe('formSubmissionError', (message,  payload) => {
      let { errors: payloadErrors } = payload;
      const { form } = payload;

      if (!payloadErrors) {
         payloadErrors = []
      }
      const updated = payloadErrors.map(error => {
        return {message: error.message, instance: form.formio.getComponent(error.component.key)};
      });
      this.setState({
        formErrors: updated
      })
    });
    this.formSubmissionSuccessful = PubSub.subscribe('formSubmissionSuccessful', () => {
      this.setState({
        formErrors: []
      });
    });
    this.clear = PubSub.subscribe('clear', () => {
      this.setState({
        formErrors: []
      });
    });
    this.formChange = PubSub.subscribe('formChange', (message, {value, form}) => {
      if (this.state.formErrors.length !== 0) {
        let instance;
        if (form.instance._form.display === 'wizard') {
          instance = form.formio.currentPage;
        } else {
          instance = form.formio;
        }
        if (instance.isValid(value.data, true)) {
          this.setState({
            formErrors: []
          });
        } else {
          this.setState({
            formErrors: _.filter(this.state.formErrors, ({message, instance}) => {
              return instance.component.key !== value.changed.component.key;
            })
          })
        }
      }
    });
  }

  componentDidUpdate() {
    const { hasError, errors, kc, history, log } = this.props;

    if (hasError) {
      const { pathname: path } = history.location;
      const { email: user } = kc.tokenParsed;
      const errors = errors ? errors.map(error => {
          return {
            path,
            level: 'debug',
            status: error.get('status'),
            message: error.get('message'),
            url: error.get('url'),
            user,
          }
        }) : [];
      log(errors);
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.formSubmissionError);
    PubSub.unsubscribe(this.formSubmissionSuccessful);
    PubSub.unsubscribe(this.clear);
    PubSub.unsubscribe(this.formChange);
  }

  componentDidCatch(error, errorInfo) {
    const { history, kc, log } = this.props;

    const { pathname: path } = history.location;
    const {email: user } = kc.tokenParsed;

    log([{
      level: 'debug',
      user,
      path,
      error,
      errorInfo
    }]);
  }

  render() {
    return (
      <React.Fragment>
        <ErrorPanel {...this.props} />
        <FormErrorPanel errors={this.state.formErrors} />
        {this.props.children}
      </React.Fragment>
);
  }
}

ErrorHandlingComponent.propTypes = {
  log: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  errors: ImmutablePropTypes.list.isRequired,
  unauthorised: PropTypes.bool.isRequired,
  kc: PropTypes.object.isRequired,
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => {
  return {
    kc: state.keycloak,
    hasError: hasError(state),
    errors: errors(state),
    unauthorised: unauthorised(state),
    appConfig: state.appConfig

  };
}, mapDispatchToProps)(ErrorHandlingComponent));
