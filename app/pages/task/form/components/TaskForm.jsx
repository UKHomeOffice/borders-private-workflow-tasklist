import React from 'react';
import {Form} from 'react-formio';
import AppConstants from "../../../../common/AppConstants";
import GovUKFrontEndObserver from '../../../../core/util/GovUKFrontEndObserver';

export default class TaskForm extends React.Component {

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
        hooks: {
            beforeCancel: (...args) => {
                this.handleCancel(args);
            }
        }
    };

    render() {
        const {onCustomEvent, variables, task, onSubmitTaskForm, formReference, form} = this.props;
        const formVariableSubmissionName = `${form.name}::submissionData`;
        const submissionData = variables['submissionData'] ? variables['submissionData'] : (variables[formVariableSubmissionName]
            ? variables[formVariableSubmissionName] : null);

        const variableInput = form.components.find(c => c.key === 'submitVariableName');
        const variableName = variableInput ? variableInput.defaultValue : form.name;


        if (!task.get('assignee')) {
            this.options.readOnly = true;
        }
        if (submissionData) {
            return <Form form={form} options={this.options} ref={form => {this.formNode = form; formReference(form);}}
                         onCustomEvent={(event) => onCustomEvent(event, variableName)}
                         submission={JSON.parse(submissionData)} onSubmit={(submission) => {
                onSubmitTaskForm(submission.data, variableName);
            }}/>;
        } else {
            return <Form form={form} ref={form => {this.formNode = form; formReference(form);}} options={this.options}
                         onCustomEvent={(event) => onCustomEvent(event, variableName)}
                         onSubmit={(submission) => {
                             onSubmitTaskForm(submission.data, variableName);
                         }}/>;
        }

    }

    componentWillUnmount() {
        this.observer.destroy();
    }
}
