import React from 'react';
import {Form} from "react-formio";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {fetchActionForm, resetSelectedAction, executeAction, clearActionResponse} from "../actions";
import {actionForm, actionResponse, executingAction, loadingActionForm} from "../selectors";
import withLog from "../../../../core/error/component/withLog";
import FormioInterpolator from "../../../../core/FormioInterpolator";
import secureLocalStorage from "../../../../common/security/SecureLocalStorage";
import FileService from "../../../../core/FileService";

class CaseAction extends React.Component {
    constructor(props) {
        super(props);
        this.formioInterpolator = new FormioInterpolator();
    }

    componentDidMount() {
        if (this.props.selectedAction) {
            this.props.fetchActionForm(this.props.selectedAction.process.formKey);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedAction.process['process-definition'].key !==
            prevProps.selectedAction.process['process-definition'].key) {
            this.props.clearActionResponse();
            this.props.fetchActionForm(this.props.selectedAction.process.formKey);
        }
        if (this.props.actionResponse) {
            const that = this;
            this.timer = setTimeout(() => {
                that.props.clearActionResponse();
            }, 5000);
        }
    }

    componentWillUnmount() {
        this.props.resetSelectedAction();
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        const {
            selectedAction, caseDetails,
            loadingActionForm, actionForm, kc, appConfig,
            executingAction, actionResponse
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

        const submission = {
            caseDetails,
            selectedAction,
            keycloakContext: {
                accessToken: kc.token,
                refreshToken: kc.refreshToken,
                sessionId: kc.tokenParsed.session_state,
                email: kc.tokenParsed.email,
                givenName: kc.tokenParsed.given_name,
                familyName: kc.tokenParsed.family_name
            },
            shiftDetailsContext: secureLocalStorage.get('shift'),
            staffDetailsDataContext: secureLocalStorage.get(`staffContext::${kc.tokenParsed.email}`),
            extendedStaffDetailsContext: secureLocalStorage.get('extendedStaffDetails'),
            environmentContext: {
                referenceDataUrl: appConfig.apiRefUrl,
                workflowUrl: appConfig.workflowServiceUrl,
                operationalDataUrl: appConfig.operationalDataUrl,
                privateUiUrl: window.location.origin
            }
        };

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
                : null}
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
                                  submissionDate: new Date(),
                                  process: {
                                      definitionId: selectedAction.process['process-definition'].id
                                  }
                              };
                              next();
                          }
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
    })
};


const mapDispatchToProps = dispatch => bindActionCreators({
    fetchActionForm,
    resetSelectedAction, executeAction, clearActionResponse
}, dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        loadingActionForm: loadingActionForm(state),
        actionForm: actionForm(state),
        executingAction: executingAction(state),
        actionResponse: actionResponse(state)
    }
}, mapDispatchToProps)(withLog(CaseAction)));


