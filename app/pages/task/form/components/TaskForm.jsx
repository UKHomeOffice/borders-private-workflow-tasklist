import React from 'react';
import { Form, Formio } from 'react-formio';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AppConstants from '../../../../common/AppConstants';
import GovUKDetailsObserver from '../../../../core/util/GovUKDetailsObserver';
import FormioEventListener from '../../../../core/util/FormioEventListener';
import FileService from '../../../../core/FileService';
import secureLocalStorage from '../../../../common/security/SecureLocalStorage';
import FormioInterpolator from '../../../../core/FormioInterpolator';

export default class TaskForm extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.formNode = React.createRef();
    this.formioInterpolator = new FormioInterpolator();
  }

  componentDidMount() {
    this.observer = new GovUKDetailsObserver(this.formNode.element).create();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const taskFormDeregister = Formio.deregisterPlugin(
      'taskSubProcessInterpolation',
    );
    console.log('taskFormDeregister', taskFormDeregister);
    this.observer.destroy();
  }

  handleCancel = resetForm => {
    this.props.history.replace(AppConstants.DASHBOARD_PATH);
    resetForm(false);
  };

  render() {
    const {
      onCustomEvent,
      variables,
      task,
      onSubmitTaskForm,
      formReference,
      form,
      kc,
      appConfig,
    } = this.props;
    const formVariableSubmissionName = `${form.name}::submissionData`;

    const options = {
      noAlerts: true,
      fileService: new FileService(kc),
      hooks: {
        beforeCancel: (...args) => {
          this.handleCancel(args);
        },
        beforeSubmit: (submission, next) => {
          [
            'keycloakContext',
            'staffDetailsDataContext',
            'taskContext',
            'processContext',
          ].forEach(k => {
            delete submission.data[k];
          });
          submission.data.form = {
            formVersionId: form.versionId,
            formId: form.id,
            title: form.title,
            name: form.name,
            submissionDate: new Date(),
            submittedBy: kc.tokenParsed.email,
            process: {
              definitionId: task.get('processDefinitionId'),
            },
          };
          next();
        },
      },
      i18n: {
        en: {
          submit: 'Submit',
        },
      },
    };
    let submission = {};

    if (variables) {
      if (variables.submissionData) {
        submission = variables.submissionData;
      } else if (variables[formVariableSubmissionName]) {
        submission = variables[formVariableSubmissionName];
      }

    }
    if (secureLocalStorage.get(task.get('id'))) {
      submission.data = {
        ...submission.data,
        ...secureLocalStorage.get(task.get('id'))
      }
    }
    submission.data = {
      ...submission.data,
      keycloakContext: {
        accessToken: kc.token,
        refreshToken: kc.refreshToken,
        sessionId: kc.tokenParsed.session_state,
        email: kc.tokenParsed.email,
        givenName: kc.tokenParsed.given_name,
        familyName: kc.tokenParsed.family_name,
        subject: kc.subject,
        url: kc.authServerUrl,
        realm: kc.realm,
      },
      shiftDetailsContext: secureLocalStorage.get('shift'),
      staffDetailsDataContext: secureLocalStorage.get(
        `staffContext::${kc.tokenParsed.email}`,
      ),
      extendedStaffDetailsContext: secureLocalStorage.get(
        'extendedStaffDetails',
      ),
      environmentContext: {
        referenceDataUrl: appConfig.apiRefUrl,
        workflowUrl: appConfig.workflowServiceUrl,
        operationalDataUrl: appConfig.operationalDataUrl,
        privateUiUrl: window.location.origin,
        attachmentServiceUrl: appConfig.attachmentServiceUrl
      },
      processContext: _.omit(variables,  ['submissionData', formVariableSubmissionName]),
      taskContext: task.toJS(),
    };
    if (form) {
      const that = this;
      Formio.registerPlugin(
        {
          priority: 0,
          requestResponse(response) {
            return {
              ok: response.ok,
              json: () =>
                response.json().then(result => {
                  if (!Array.isArray(result) && _.has(result, 'display')) {
                    that.formioInterpolator.interpolate(
                      result,
                      submission.data,
                    );
                    return result;
                  }
                  return result;
                }),
              status: response.status,
              headers: response.headers,
            };
          },
        },
        'taskSubProcessInterpolation',
      );
    }

    const variableInput = form.components.find(
      c => c.key === 'submitVariableName',
    );
    const variableName = variableInput ? variableInput.defaultValue : form.name;

    if (!task.get('assignee')) {
      options.readOnly = true;
    }
    this.formioInterpolator.interpolate(form, submission.data);
    return (
      <Form
        form={form}
        options={options}
        ref={form => {
          this.form = form;
          formReference(form);
          this.formNode = form;
          if (this.form) {
            this.form.createPromise.then(() => {
              new FormioEventListener(this.form, this.props);
            });
          }
        }}
        onChange={instance => {
          secureLocalStorage.set(task.get('id'),
              _.omit(instance.data,
                  ['keycloakContext',
                   'shiftDetailsContext',
                  'staffDetailsDataContext',
                  'extendedStaffDetailsContext',
                  'environmentContext',
                  'processContext', 'taskContext']))
        }}
        onCustomEvent={event => onCustomEvent(event, variableName)}
        submission={submission}
        onSubmit={submission => {
          onSubmitTaskForm(submission.data, variableName);
        }}
      />
    );
  }
}
