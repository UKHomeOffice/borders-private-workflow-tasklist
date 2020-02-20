import React from 'react';
import {Form} from "react-formio";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {fetchActionForm, reset, executeAction ,clearActionResponse} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
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
        this.props.fetchActionForm(this.props.selectedAction.process.formKey);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.actionResponse) {
            const that = this;
            this.timer = setTimeout(() => {
                that.props.clearActionResponse();
            }, 5000);
        }
    }

    componentWillUnmount() {
        this.props.reset();
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
            return <div/>
        }
        if (loadingActionForm) {
            return <div>Loading</div>
        }
        if (!actionForm) {
            return <div/>
        }

        if (executingAction) {
            return <div>Submitting action...</div>
        }

        const submission = {
            caseDetails: caseDetails,
            selectedAction: selectedAction,
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
        return <div className="govuk-card">
            {actionResponse ? <div className="govuk-panel govuk-panel--confirmation">
                    <div className="govuk-panel__body govuk-!-font-size-24 govuk-!-font-weight-bold">
                        {selectedAction.completionMessage}
                    </div>
                </div>
                : null}
            <Form form={actionForm}
                  options={{
                      noAlerts: true,
                      fileService: new FileService(kc),
                      readOnly: this.props.executingAction,
                      hooks: {
                          beforeSubmit: (submission, next) => {
                              ['keycloakContext', 'staffDetailsDataContext',
                                  'taskContext',
                                  'processContext']
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
                      (submission) => {
                          if (!this.props.executingAction) {
                              this.props.executeAction(
                                  selectedAction,
                                  submission.data,
                                  caseDetails
                              );
                          }
                      }
                  }

            /></div>
    }
}

CaseAction.propTypes = {
    clearActionResponse: PropTypes.func,
    executingAction: PropTypes.bool,
    actionResponse: PropTypes.object,
    executeAction: PropTypes.func,
    reset: PropTypes.func,
    actionForm: PropTypes.object,
    fetchActionForm: PropTypes.func,
    loadingActionForm: PropTypes.bool,
    caseDetails: PropTypes.shape({
        businessKey: PropTypes.string
    }),
    selectedAction: PropTypes.shape({
        completionMessage: PropTypes.string,
        process: PropTypes.shape({
            formKey: PropTypes.string,
            ['process-definition']: PropTypes.shape({
                id: PropTypes.string,
                key: PropTypes.string,
                description: PropTypes.string,
                name: PropTypes.string
            })
        })
    })
};


const mapDispatchToProps = dispatch => bindActionCreators({fetchActionForm,
    reset, executeAction, clearActionResponse}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        loadingActionForm: loadingActionForm(state),
        actionForm: actionForm(state),
        executingAction: executingAction(state),
        actionResponse: actionResponse(state)
    }
}, mapDispatchToProps)(withLog(CaseAction)));


