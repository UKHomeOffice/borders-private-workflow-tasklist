import React from 'react';
import {Form} from 'react-formio';
import AppConstants from '../../../../common/AppConstants';
import GovUKDetailsObserver from "../../../../core/util/GovUKDetailsObserver";
import FormioEventListener from "../../../../core/util/FormioEventListener";
import FileService from "../../../../core/FileService";

export default class TaskForm extends React.Component {

    constructor(props) {
        super(props);
        this.formNode = React.createRef();
    }

    componentDidMount() {
        this.observer = new GovUKDetailsObserver(this.formNode.element).create();
    }

    componentWillUnmount() {
        this.observer.destroy();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    handleCancel = (resetForm) => {
        this.props.history.replace(AppConstants.DASHBOARD_PATH);
        resetForm(false);
    };


    render() {
        const {onCustomEvent, variables, task, onSubmitTaskForm, formReference, form, kc} = this.props;
        const formVariableSubmissionName = `${form.name}::submissionData`;
        const options = {
            noAlerts: true,
            hooks: {
                beforeCancel: (...args) => {
                    this.handleCancel(args);
                },
                fileService: new FileService(kc),
                beforeSubmit: (submission, next) => {
                    submission.data.meta = {
                        formVersionId: form.versionId,
                        formId: form.id,
                        title: form.title,
                        name: form.name,
                        submissionDate: new Date(),
                        submittedBy: kc.tokenParsed.email
                    };
                    next();
                }
            },
            i18n: {
                en: {
                    submit: 'Submit',
                }
            },
        };
        let submissionData = null;

        if (variables) {
            if (variables['submissionData']) {
                submissionData = variables['submissionData']
            } else if (variables[formVariableSubmissionName]) {
                submissionData = variables[formVariableSubmissionName];
            }
        }

        const variableInput = form.components.find(c => c.key === 'submitVariableName');
        const variableName = variableInput ? variableInput.defaultValue : form.name;

        if (!task.get('assignee')) {
            options.readOnly = true;
        }
        return <Form form={form} options={options}
                     ref={form => {
                         this.form = form;
                         formReference(form);
                         this.formNode = form;
                         if (this.form) {
                             this.form.createPromise.then(() => {
                                 new FormioEventListener(this.form, this.props);
                             });
                         }
                     }
                     }
                     onCustomEvent={(event) => onCustomEvent(event, variableName)}
                     submission={JSON.parse(submissionData)} onSubmit={(submission) => {
            onSubmitTaskForm(submission.data, variableName);
        }}/>;
    }

}
