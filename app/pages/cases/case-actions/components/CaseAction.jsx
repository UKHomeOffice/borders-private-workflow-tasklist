import React from 'react';
import { Form } from "react-formio";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { fetchActionForm, resetSelectedAction, executeAction, clearActionResponse } from "../actions";
import { getFormSubmissionData, resetForm } from "../../actions";
import { actionForm, actionResponse, executingAction, loadingActionForm } from "../selectors";
import { formSubmissionData } from "../../selectors";
import withLog from "../../../../core/error/component/withLog";
import FormioInterpolator from "../../../../core/FormioInterpolator";
import secureLocalStorage from "../../../../common/security/SecureLocalStorage";
import FileService from "../../../../core/FileService";
import { getCaseByKey } from '../../actions';

class CaseAction extends React.Component {
  constructor(props) {
    super(props);
    this.formioInterpolator = new FormioInterpolator();
  }

  latestFormDataPath = (processInstances, formKey) => {
    return processInstances
      .map(({ formReferences }) => formReferences)
      .reduce((acc, val) => acc.concat(val), [])
      .reduce((acc, { name, dataPath }) => name === formKey ? dataPath : acc, '')
  }

  componentDidMount() {
    const {
      caseDetails: { businessKey, processInstances = [] } = {},
      fetchActionForm,
      getFormSubmissionData,
      selectedAction,
      selectedAction: { process: { formKey } = {} } = {}
    } = this.props;

    if (selectedAction) {
      fetchActionForm(formKey);

      const latestFormDataPath = this.latestFormDataPath(processInstances, formKey);

      if (latestFormDataPath) {
        getFormSubmissionData(businessKey, latestFormDataPath);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      caseDetails: { businessKey, processInstances = [] } = {},
      getFormSubmissionData,
      selectedAction: { process: currProcess, process: { formKey } = {} } = {}
    } = this.props;

    const { selectedAction: { process: prevProcess } = {} } = prevProps;

    if (currProcess['process-definition'].key !== prevProcess['process-definition'].key) {
      this.props.clearActionResponse();
      this.props.fetchActionForm(formKey);
      const latestFormDataPath = this.latestFormDataPath(processInstances, formKey);

      if (latestFormDataPath) {
        getFormSubmissionData(businessKey, latestFormDataPath);
      }
    }

    if (this.props.actionResponse) {
      const that = this;
      this.timer = setTimeout(() => {
        that.props.clearActionResponse();
        this.props.getCaseByKey(this.props.caseDetails.businessKey);
      }, 5000);
    }
  }

  componentWillUnmount() {
    this.props.resetSelectedAction();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.props.resetForm();
  }

  render() {
    const {
      selectedAction, caseDetails,
      loadingActionForm, actionForm, kc, appConfig,
      executingAction, actionResponse, formSubmissionData
    } = this.props;
    if (!selectedAction || !caseDetails) {
      return <div id="emptyAction" />
    }
    if (loadingActionForm) {
      return <div id="loadingActionForm">Loading</div>
    }
    if (!actionForm) {
      return <div id="emptyForm" />
    }

    if (executingAction) {
      return <div id="submittingAction">Submitting action...</div>
    }

    let submission = {
      caseDetails,
      selectedAction,
      keycloakContext: {
        accessToken: kc.token,
        refreshToken: kc.refreshToken,
        sessionId: kc.tokenParsed.session_state,
        email: kc.tokenParsed.email,
        givenName: kc.tokenParsed.given_name,
        familyName: kc.tokenParsed.family_name,
        groups: kc.tokenParsed.groups
      },
      shiftDetailsContext: secureLocalStorage.get(`shift::${kc.tokenParsed.email}`),
      staffDetailsDataContext: secureLocalStorage.get(`staffContext::${kc.tokenParsed.email}`),
      extendedStaffDetailsContext: secureLocalStorage.get(`extendedStaffDetails::${kc.tokenParsed.email}`),
      environmentContext: {
        referenceDataUrl: appConfig.apiRefUrl,
        workflowUrl: appConfig.workflowServiceUrl,
        operationalDataUrl: appConfig.operationalDataUrl,
        privateUiUrl: window.location.origin,
        attachmentServiceUrl: appConfig.attachmentServiceUrl
      }
    };

    const isPrepopulated = actionForm.components.find(c => c.key === 'caseActionPrepopulate');
    if (isPrepopulated) {
      submission = {
        ...submission,
        ...formSubmissionData
      }
    }

    this.formioInterpolator.interpolate(actionForm, submission);
    return (
      <div>
        {actionResponse ? (
          <div className="govuk-panel govuk-panel--confirmation">
            <div className="govuk-panel__body govuk-!-font-size-24 govuk-!-font-weight-bold">
              {selectedAction.completionMessage}
            </div>
          </div>
        )
          :
          (
            <Form
              form={actionForm}
              options={{
                noAlerts: true,
                fileService: new FileService(kc),
                readOnly: this.props.executingAction,
                hooks: {
                  beforeSubmit: (submission, next) => {
                    ['keycloakContext',
                      'staffDetailsDataContext',
                      'selectedAction',
                      'caseDetails']
                      .forEach(k => {
                        delete submission.data[k];
                      });
                    submission.data.form = {
                      formVersionId: actionForm.versionId,
                      formId: actionForm.id,
                      title: actionForm.title,
                      name: actionForm.name,
                      submittedBy: kc.tokenParsed.email,
                      submissionDate: new Date(),
                      process: {
                        definitionId: selectedAction.process['process-definition'].id
                      }
                    };
                    next();
                  },
                  beforeCancel: () => this.componentDidMount()
                }
              }}
              submission={{
                data: submission
              }}
              onSubmit={
                submission => {
                  if (!this.props.executingAction) {
                    this.props.executeAction(
                      selectedAction,
                      submission.data,
                      caseDetails
                    );
                  }
                }
              }
            />
          )}
      </div>
    )
  }
}

CaseAction.propTypes = {
  clearActionResponse: PropTypes.func,
  appConfig: PropTypes.object,
  executingAction: PropTypes.bool,
  actionResponse: PropTypes.object,
  executeAction: PropTypes.func,
  resetSelectedAction: PropTypes.func,
  actionForm: PropTypes.object,
  fetchActionForm: PropTypes.func,
  loadingActionForm: PropTypes.bool,
  kc: PropTypes.object,
  caseDetails: PropTypes.shape({
    businessKey: PropTypes.string
  }),
  selectedAction: PropTypes.shape({
    completionMessage: PropTypes.string,
    process: PropTypes.shape({
      formKey: PropTypes.string,
      'process-definition': PropTypes.shape({
        id: PropTypes.string,
        key: PropTypes.string,
        description: PropTypes.string,
        name: PropTypes.string
      })
    })
  }),
  formReference: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    formVersionId: PropTypes.string,
    dataPath: PropTypes.string,
    submissionDate: PropTypes.string,
    submittedBy: PropTypes.string
  }),
  getFormSubmissionData: PropTypes.func.isRequired,
  formSubmissionData: PropTypes.object,
  resetForm: PropTypes.func.isRequired
};


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchActionForm,
  resetSelectedAction, executeAction, clearActionResponse,
  getCaseByKey,
  getFormSubmissionData,
  resetForm
}, dispatch);

export default withRouter(connect(state => {
  return {
    kc: state.keycloak,
    appConfig: state.appConfig,
    loadingActionForm: loadingActionForm(state),
    actionForm: actionForm(state),
    executingAction: executingAction(state),
    actionResponse: actionResponse(state),
    formSubmissionData: formSubmissionData(state)
  }
}, mapDispatchToProps)(withLog(CaseAction)));


