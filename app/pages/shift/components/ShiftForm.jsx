import React from 'react';
import {Form} from 'react-formio';
import moment from 'moment';
import AppConstants from "../../../common/AppConstants";
import GovUKDetailsObserver from '../../../core/util/GovUKDetailsObserver';
import FileService from "../../../core/FileService";
import secureLocalStorage from "../../../common/security/SecureLocalStorage";
import FormioUtils from 'formiojs/utils';

export default class ShiftForm extends React.Component {

    constructor(props) {
        super(props);
        this.formNode = React.createRef();
    }

    componentDidMount() {
        this.observer = new GovUKDetailsObserver(this.formNode.element).create();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    handleCancel = (resetForm) => {
        this.props.history.replace(AppConstants.DASHBOARD_PATH);
        resetForm(false);
    };


    render() {
        const {shiftForm, shift, staffDetails, formReference, submit, kc, appConfig} = this.props;
        const options = {
            noAlerts: true,
            language: 'en',
            buttonSettings: {
                showCancel: true
            },
            fileService: new FileService(kc),
            hooks: {
                beforeCancel: (...args) => {
                    this.handleCancel(args);
                },
                beforeSubmit: (submission, next) => {
                    const toDelete = ['keycloakContext', 'staffDetailsDataContext','environmentContext'];
                    toDelete.forEach(key => {
                        delete submission.data[key];
                    });
                    next();
                }
            },
            i18n: {
                en: {
                    cancel: 'Cancel',
                    previous: 'Back',
                    submit: 'Submit',
                    next: 'Next'
                }
            },
        };
        if (!shiftForm) {
            return <div/>;
        }
        let shiftSubmission = {
            data: {
                keycloakContext: {
                    accessToken: kc.token,
                    refreshToken: kc.refreshToken,
                    sessionId: kc.tokenParsed.session_state,
                    email: kc.tokenParsed.email,
                    givenName: kc.tokenParsed.given_name,
                    familyName: kc.tokenParsed.family_name
                },
                staffDetailsDataContext: secureLocalStorage.get(`staffContext::${kc.tokenParsed.email}`),
                environmentContext: {
                    referenceDataUrl: appConfig.apiRefUrl,
                    workflowUrl: appConfig.workflowServiceUrl,
                    operationalDataUrl: appConfig.operationalDataUrl,
                    privateUiUrl: window.location.origin
                }
            }
        };

        if (shift) {
            shiftSubmission.data = {
                ...shiftSubmission.data,
                shiftminutes: shift.get('shiftminutes'),
                shifthours: shift.get('shifthours'),
                startdatetime: moment.utc(shift.get('startdatetime')),
                teamid: shift.get('teamid'),
                locationid: shift.get('locationid'),
                phone: shift.get('phone')
            };
        } else {
            if (staffDetails) {
                shiftSubmission.data = {
                    ...shiftSubmission.data,
                    shiftminutes: 0,
                    shifthours: 8,
                    startdatetime: moment.utc(moment()),
                    teamid: staffDetails.get('defaultteamid'),
                    locationid: staffDetails.get('defaultlocationid'),
                    phone: staffDetails.get('phone')
                };
            }

        }
        FormioUtils.eachComponent(shiftForm.components, component => {
            if (component.defaultValue) {
                component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
                    data: shiftSubmission.data
                })
            }
        });
        return <Form form={shiftForm} submission={shiftSubmission} options={options}
                     ref={form => {
                         this.formNode = form;
                         formReference(form);
                     }}
                     onSubmit={(submission) => {
                         submit(shiftForm, submission)
                     }}/>

    }


    componentWillUnmount() {
        this.observer.destroy();
    }

}

