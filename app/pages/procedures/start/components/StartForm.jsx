import React from 'react';
import {Form} from 'react-formio';
import AppConstants from '../../../../common/AppConstants';
import GovUKFrontEndObserver from '../../../../core/util/GovUKFrontEndObserver';
import FileService from '../../../../core/FileService';

class StartForm extends React.Component {
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
    this.props.history.replace(AppConstants.PROCEDURES_PATH);
    resetForm(false);
  };



  render() {
    const { dataChange, submission, formReference, handleSubmit, onCustomEvent, startForm, kc} = this.props;
    const options = {
      noAlerts: true,
      language: 'en',
      fileService: new FileService(kc),
      hooks:{
        beforeCancel: (...args) => {
          this.handleCancel(args);
        }
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
    if (submission) {
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
    } else {
      return <Form
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

  }

  componentWillUnmount() {
    this.observer.destroy();
  }

}

export default StartForm;
