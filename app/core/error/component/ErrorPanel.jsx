import React from "react";

const uuidv4 = require('uuid/v4');

export default class ErrorPanel extends React.Component {

    render() {
        const {hasError, errors} = this.props;
        if (!errors) {
            return null;
        }
        const items = [];
        const buildMessageFrom = err => {
            const code = err.get('status');
            let itemMessage;
            switch (code) {
                case 409:
                    itemMessage = `The form with reference '${err.get('payload')}' has already been submitted.`;
                    break;
                case 404:
                    itemMessage = `${err.get('message')}`;
                    break;
                case 401:
                case 403:
                    itemMessage = 'Unable to complete your request due to authorization issues.';
                    break;
                case 400:
                    itemMessage = 'Unable to complete your request due to form submission issues.';
                    break;
                default:
                    itemMessage = 'Internal system error.';
            }
            return <li key={uuidv4()}><h4 style={{'color' : '#d4351c'}} className="govuk-heading-s">{itemMessage}</h4></li>
        };
        errors.forEach(err => {
            items.push(buildMessageFrom(err));
        });
        if (hasError) {
            return (
              <div
                className="govuk-error-summary"
                role="alert"
                aria-labelledby="error-summary-title"
                tabIndex="-1"
              >
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    We are experiencing technical problems
                </h2>

                <div className="govuk-error-summary__body">
                  <ul className="govuk-list govuk-error-summary__list">
                    {items}
                  </ul>
                </div>

                <h4 className="govuk-heading-s">Please contact support by clicking <a className="govuk-link" target="_blank" href={this.props.appConfig.serviceDeskUrls.support}>here</a></h4>

                <details className="govuk-details">
                  <summary className="govuk-details__summary">
                    <span className="govuk-details__summary-text">
                         Error details
                    </span>
                  </summary>
                  <div className="govuk-details__text">
                    <div className="govuk-error-summary__body">
                      <ul className="govuk-list govuk-list--bullet govuk-error-summary__list">
                        {errors.map(error => {
                                   return <li key={uuidv4()}>URL: {error.get('url')} - Code: {error.get('status')}</li>
                               })}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
)
        } 
            return null;
        
    }
}



