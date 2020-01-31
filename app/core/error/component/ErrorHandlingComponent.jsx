import React from 'react';
import PropTypes from 'prop-types';
import { errors, hasError, unauthorised } from '../selectors';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {  withRouter } from 'react-router';
import ErrorPanel from './ErrorPanel';
import PubSub from 'pubsub-js';
import FormErrorPanel from './FormErrorPanel';

export class ErrorHandlingComponent extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      formErrors: []
    }
  }
  componentDidMount() {
    this.mounted = true;
    PubSub.subscribe('formSubmissionError', (msg,  payload) => {
      let errors = payload.errors;
      const form = payload.form;
      if (!errors) {
         errors = []
      }
      const updated = errors.map(error => {
        return {message: error.message, instance: form.formio.getComponent(error.component.key)};
      });
      this.setState({
        formErrors: updated
      })
    });
    PubSub.subscribe('formSubmissionSuccessful', (msg) => {
      if (this.mounted) {
        this.setState({
          formErrors: []
        });
      }
    });
    PubSub.subscribe('clear', (msg) => {
      if (this.mounted) {
        this.setState({
          formErrors: []
        });
      }

    });
    PubSub.subscribe('formChange', (msg, {value, form}) => {
      if (this.mounted) {
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
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.hasError) {
      const path = this.props.history.location.pathname;
      const user = this.props.kc.tokenParsed.email;
      const errors = this.props.errors ? this.props.errors.map((error) => {
          return {
            path: path,
            level: 'error',
            status: error.get('status'),
            message: error.get('message'),
            url: error.get('url'),
            user: user,
          }
        }) : [];
      this.props.log(errors);
    }
  }

  componentDidCatch(error, errorInfo) {
    const path = this.props.history.location.pathname;
    const user = this.props.kc.tokenParsed.email;
    this.props.log([{
      level: 'error',
      user: user,
      path: path,
      error,
      errorInfo
    }]);
  }

  render() {
    return <React.Fragment>
            <ErrorPanel {...this.props} />
            <FormErrorPanel errors={this.state.formErrors} />
            {this.props.children}
    </React.Fragment>;
  }
}

ErrorHandlingComponent.propTypes = {
  log: PropTypes.func,
  hasError: PropTypes.bool,
  errors: ImmutablePropTypes.list,
  unauthorised: PropTypes.bool
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect((state) => {
  return {
    kc: state.keycloak,
    hasError: hasError(state),
    errors: errors(state),
    unauthorised: unauthorised(state),
    appConfig: state.appConfig

  };
}, mapDispatchToProps)(ErrorHandlingComponent));
