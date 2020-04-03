import React from 'react';
import PubSub from 'pubsub-js';


class SubmissionBanner extends React.Component {

  constructor() {
    super();
    this.state = { submission: false, message: null, visibility: 'hidden' };
    this.handleSubmission = this.handleSubmission.bind(this);
    this.token = PubSub.subscribe('submission', this.handleSubmission);
  }

  componentWillUnmount() {
    if (this.token) {
      PubSub.unsubscribe(this.token);
    }
  }

  handleSubmission(mgs, data) {
    this.setState({
      submission: data.submission,
      message: data.message,
      type: data.type ? data.type : 'success',
      autoDismiss: data.autoDismiss ? data.autoDismiss : true
    });

    if (data.autoDismiss) {
      setTimeout(() => {
        this.setState({
          submission: false, message: null, type: null, autoDismiss: true
        });
      }, 10000);
    }
  }

  render() {
    const { submission, message, type } = this.state;
    if (submission) {
       if (type === 'warning') {
         return (
           <div style={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
             <div className="govuk-warning-text">
               <span className="govuk-warning-text__icon" aria-hidden="true" style={{width: '40px', height:'40px'}}>!</span>
               <strong className="govuk-warning-text__text">
                 <span className="govuk-warning-text__assistive">Warning</span>
                 {message}
               </strong>
             </div>
           </div>
)
       } 
         return (
           <div className="container" id="successfulSubmission" style={{paddingTop: '5px'}}>
             <div className="govuk-panel govuk-panel--confirmation">
               <div className="govuk-panel__body govuk-!-font-size-24 govuk-!-font-weight-bold">
                 {message}
               </div>
             </div>
           </div>
)
       
    } 
      return null;
    
  }
}

export default SubmissionBanner;
