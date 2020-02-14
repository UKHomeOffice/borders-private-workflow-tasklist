import React from 'react';
import {Form, Formio} from 'react-formio';
import AppConstants from '../../../../common/AppConstants';
import GovUKDetailsObserver from '../../../../core/util/GovUKDetailsObserver';
import FileService from '../../../../core/FileService';
import secureLocalStorage from "../../../../common/security/SecureLocalStorage";
import FormioInterpolator from '../../../../core/FormioInterpolator';
import _ from 'lodash';

class StartForm extends React.Component {
    constructor(props) {
        super(props);
        this.formNode = React.createRef();
        this.formioInterpolator = new FormioInterpolator();
    }

    componentDidMount() {
        this.observer = new GovUKDetailsObserver(this.formNode.element).create();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    handleCancel = (resetForm) => {
        this.props.history.replace(AppConstants.FORMS_PATH);
        resetForm(false);
    };

    render() {
        const {
            dataChange, formReference, handleSubmit, onCustomEvent, appConfig,
            startForm, kc, processDefinition
        } = this.props;
        let submission = secureLocalStorage.get(processDefinition.getIn(['process-definition', 'id']));
        if (!submission) {
            submission = {};
        }
        submission = {
            ...submission, keycloakContext: {
                accessToken: kc.token,
                refreshToken: kc.refreshToken,
                sessionId: kc.tokenParsed.session_state,
                email: kc.tokenParsed.email,
                givenName: kc.tokenParsed.given_name,
                familyName: kc.tokenParsed.family_name
            }
        };

        if (!submission.shiftDetailsContext) {
            submission = {
                ...submission, shiftDetailsContext: secureLocalStorage.get('shift')
            }
        }
        if (!submission.staffDetailsDataContext) {
            submission = {
                ...submission,
              staffDetailsDataContext: secureLocalStorage.get(`staffContext::${kc.tokenParsed.email}`)
            };
        }
        if (!submission.extendedStaffDetailsContext) {
            submission = {
                ...submission,
              extendedStaffDetailsContext: secureLocalStorage.get('extendedStaffDetails')
            };
        }
        if (!submission.environmentContext) {
            submission = {
                ...submission, environmentContext: {
                    referenceDataUrl: appConfig.apiRefUrl,
                    workflowUrl: appConfig.workflowServiceUrl,
                    operationalDataUrl: appConfig.operationalDataUrl,
                    privateUiUrl: window.location.origin
                }
            };
        }
        const options = {
            noAlerts: true,
            language: 'en',
            fileService: new FileService(kc),
            hooks: {
                beforeCancel: (...args) => {
                    this.handleCancel(args);
                },
                beforeSubmit: (submission, next) => {
                    const toDelete = ['keycloakContext', 'staffDetailsDataContext'];
                    toDelete.forEach(key => {
                        delete submission.data[key];
                    });
                    submission.data.form = {
                        formVersionId: startForm.versionId,
                        formId: startForm.id,
                        title: startForm.title,
                        name: startForm.name,
                        submissionDate: new Date(),
                        process: {
                            key: processDefinition.getIn(['process-definition', 'key']),
                            definitionId: processDefinition.getIn(['process-definition', 'id']),
                            name: processDefinition.getIn(['process-definition', 'name']),
                        }
                    };
                    next();
                }
            },
            breadcrumbSettings: {
                clickable: false
            },
            buttonSettings: {
                showCancel: true
            },
            i18n: {
                en: {
                    submit: 'Submit',
                    cancel: 'Cancel',
                    previous: 'Back',
                    next: 'Next'
                }
            }
        };
        if (startForm) {
            const that = this;
            Formio.registerPlugin({
                priority: 0,
                requestResponse: function (response) {
                    return {
                        ok: response.ok,
                        json: () => response.json().then((result) => {
                            if (!Array.isArray(result) && _.has(result, 'display')) {
                                that.formioInterpolator.interpolate(result, submission);
                                return result;
                            }
                            return result;
                        }),
                        status: response.status,
                        headers: response.headers
                    };
                }
            }, 'processSubFormInterpolation');
        }

        this.formioInterpolator.interpolate(startForm, submission);
        return <Form
            submission={{
                data: submission
            }}
            onChange={(instance) => dataChange(instance)}
            form={startForm}
            ref={form => {
                console.log('form', form);
                this.formNode = form;
                formReference(form);
            }}
            options={options}
            onCustomEvent={(event) => onCustomEvent(event)}
            onSubmit={(submission) => handleSubmit(submission)}/>;
    }

    componentWillUnmount() {
        const startFormDeregister = Formio.deregisterPlugin('processSubFormInterpolation');
        console.log('startFormDeregister', startFormDeregister);
        this.observer.destroy();
    }

}

export default StartForm;
