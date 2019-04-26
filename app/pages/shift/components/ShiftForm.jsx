import React from 'react';
import { Form } from 'react-formio';
import  moment from 'moment';

export default class ShiftForm extends React.Component {

  constructor(props) {
    super(props);
    this.cancelButtonAdded = false;
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
          this.props.history.replace('/dashboard');
        });
      this.cancelButtonAdded = true;
    }
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return false;
  }

  render() {
    const { shiftForm, shift, staffDetails, formReference, submit} = this.props;
    const options = {
      noAlerts: true,
      language: 'en',
      buttonSettings: {
        showCancel: false
      },
      i18n: {
        en: {
          cancel: 'Cancel',
          previous: 'Back',
          next: 'Next'
        }
      },
    };
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
      options.i18n.en.submit = 'Amend shift';

      return <Form form={shiftForm} submission={shiftSubmission} options={options}
                   ref={(form) => {
                     formReference(form);
                   }}
                   onNextPage={() => {
                     this.resetCancelButton();
                   }}
                   onPrevPage={() => {
                     this.resetCancelButton();
                   }}
                   onRender={() => this.onRender()}
                   onSubmit={(submission) => {
                     submit(shiftForm, submission);
                   }}/>;
    } else {
      options.i18n.en.submit = 'Start shift';
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
        return <Form form={shiftForm} submission={shiftSubmission} options={options}
                     ref={(form) => {
                       formReference(form)
                     }}
                     onNextPage={() => {
                       this.resetCancelButton();
                     }}
                     onPrevPage={() => {
                       this.resetCancelButton();
                     }}
                     onRender={() => this.onRender()}
                     onSubmit={(submission) => {
                       submit(shiftForm, submission)
                     }} />
      } else {
        return <Form form={shiftForm}
                     ref={(form) => formReference(form)}
                     onRender={() => this.onRender()}
                     onNextPage={() => {
                       this.resetCancelButton();
                     }}
                     onPrevPage={() => {
                       this.resetCancelButton();
                     }}
                     options={options}
                     onSubmit={(submission) =>  {
                       submit(shiftForm, submission)
                     }} />
      }
    }
  }
}

