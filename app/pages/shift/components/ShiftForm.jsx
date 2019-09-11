import React from 'react';
import {Form} from 'react-formio';
import moment from 'moment';
import AppConstants from "../../../common/AppConstants";
import GovUKFrontEndObserver from '../../../core/util/GovUKFrontEndObserver';

export default class ShiftForm extends React.Component {

    constructor(props) {
        super(props);
        this.formNode = React.createRef();
    }

    componentDidMount() {
        this.observer = new GovUKFrontEndObserver(this.formNode.element).create();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    handleCancel = (resetForm) => {
        this.props.history.replace(AppConstants.DASHBOARD_PATH);
        resetForm(false);
    };
    options = {
        noAlerts: true,
        language: 'en',
        buttonSettings: {
            showCancel: true
        },
        hooks:{
            beforeCancel: (...args) => {
                this.handleCancel(args);
            }
        },
        i18n: {
            en: {
                cancel: 'Cancel',
                previous: 'Back',
                next: 'Next'
            }
        },
    };

    render() {
        const {shiftForm, shift, staffDetails, formReference, submit} = this.props;

        if (!shiftForm) {
            return <div/>;
        }

        if (shift) {
            const shiftSubmission = {
                data: {
                    shiftminutes: shift.get('shiftminutes'),
                    shifthours: shift.get('shifthours'),
                    startdatetime: moment.utc(shift.get('startdatetime')),
                    teamid: shift.get('teamid'),
                    locationid: shift.get('locationid'),
                    phone: shift.get('phone')
                }
            };
            this.options.i18n.en.submit = 'Amend shift';

            return <Form form={shiftForm} submission={shiftSubmission} options={this.options}
                         ref={form => {
                             this.formNode = form;
                             formReference(form);
                         }}
                         onSubmit={(submission) => {
                             submit(shiftForm, submission);
                         }}/>;
        } else {
            this.options.i18n.en.submit = 'Start shift';
            if (staffDetails) {
                const shiftSubmission = {
                    data: {
                        shiftminutes: 0,
                        shifthours: 8,
                        startdatetime: moment.utc(moment()),
                        teamid: staffDetails.get('defaultteamid'),
                        locationid: staffDetails.get('defaultlocationid'),
                        phone: staffDetails.get('phone')
                    }
                };
                return <Form form={shiftForm} submission={shiftSubmission} options={this.options}
                             ref={form => {
                                this.formNode = form;
                                formReference(form);
                             }}
                             onSubmit={(submission) => {
                                 submit(shiftForm, submission)
                             }}/>
            } else {
                return <Form form={shiftForm}
                             ref={form => {
                                this.formNode = form;
                                formReference(form);
                            }}
                             options={this.options}
                             onSubmit={(submission) => {
                                 submit(shiftForm, submission)
                             }}/>
            }
        }
    }

    componentWillUnmount() {
        this.observer.destroy();
    }

}

