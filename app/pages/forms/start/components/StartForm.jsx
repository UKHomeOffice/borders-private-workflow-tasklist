import React from 'react';
import {Form} from 'react-formio';
import AppConstants from '../../../../common/AppConstants';
import GovUKDetailsObserver from '../../../../core/util/GovUKDetailsObserver';
import FileService from '../../../../core/FileService';

class StartForm extends React.Component {
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
        this.props.history.replace(AppConstants.FORMS_PATH);
        resetForm(false);
    };

    render() {
        const {dataChange, submission, formReference, handleSubmit, onCustomEvent, startForm, kc, processDefinition} = this.props;
        console.log('p', processDefinition.toJS());
        const options = {
            noAlerts: true,
            language: 'en',
            fileService: new FileService(kc),
            hooks: {
                beforeCancel: (...args) => {
                    this.handleCancel(args);
                },
                beforeSubmit: (submission, next) => {
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
                    console.log("submission", submission);
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

        return <Form
            submission={{
                data: submission
            }}
            onChange={(instance) => dataChange(instance)}
            form={startForm}
            ref={form => {
                this.formNode = form;
                formReference(form);
            }}
            options={options}
            onCustomEvent={(event) => onCustomEvent(event)}
            onSubmit={(submission) => handleSubmit(submission)}/>;
    }

    componentWillUnmount() {
        this.observer.destroy();
    }

}

export default StartForm;
