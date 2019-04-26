import React from 'react';
import { Form } from 'react-formio';


class StartForm extends React.Component {
  constructor(props) {
    super(props);
    this.cancelButtonAdded = false;
    this.options = {
      noAlerts: true,
      language: 'en',
      buttonSettings: {
        showCancel: false
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
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  resetCancelButton = () => {
    if (this.cancelButtonAdded === true) {
      this.cancelButtonAdded = false;
    }
  };


  onRender = () => {
    const hasCancelButton = $('ul.list-inline li:contains("Cancel")').length;
    if (hasCancelButton === 0 && this.cancelButtonAdded !== true) {
      $('.list-inline li:eq(0)')
        .before('<li class="list-inline-item"><button id="cancelButton" class="btn btn-default btn-secondary btn-wizard-nav-cancel">Cancel</button></li>');
      $('#cancelButton')
        .bind('click', (e) => {
          e.preventDefault();
          history.replace(AppConstants.DASHBOARD_PATH);
        });
      this.cancelButtonAdded = true;
    }
  };

  render() {
    const { dataChange, submission, formReference, handleSubmit, onCustomEvent, startForm} = this.props;
    if (submission) {
      return <Form
        onNextPage={() => {
          this.resetCancelButton();
        }}
        onPrevPage={() => {
          this.resetCancelButton();
        }}
        submission={{
          data: submission
        }}
        onChange={(instance) => dataChange(instance)}
        onRender={() => this.onRender()}
        form={startForm} ref={(form) => formReference(form)} options={this.options}
        onCustomEvent={(event) => onCustomEvent(event)}
        onSubmit={(submission) => handleSubmit(submission)}/>;
    } else {
      return <Form
        onNextPage={() => {
          this.resetCancelButton();
        }}
        onPrevPage={() => {
          this.resetCancelButton();
        }}
        onChange={(instance) => dataChange(instance)}
        onRender={() => this.onRender()}
        form={startForm} ref={(form) => formReference(form)} options={this.options}
        onCustomEvent={(event) => onCustomEvent(event)}
        onSubmit={(submission) => handleSubmit(submission)}/>;
    }

  }
}

export default StartForm;
