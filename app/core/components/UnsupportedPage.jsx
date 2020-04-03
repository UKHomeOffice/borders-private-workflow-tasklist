import React from 'react';

const UnsupportedPage = () => (
  <div
    style={{ marginTop: '20px' }}
    className="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    tabIndex="-1"
    data-module="error-summary"
  >
    <h2 className="govuk-error-summary__title" id="error-summary-title">
      Sorry, your browser is not supported
    </h2>
    <div className="govuk-error-summary__body">
      <p>
        Please use one of the{' '}
        <a
          href="https://doc.dev.cop.homeoffice.gov.uk/service.html#operational-support-model"
          target="_blank"
          rel="noopener noreferrer"
        >
          supported browsers
        </a>
        .
      </p>
      <p>
        Contact the{' '}
        <a href="https://support.cop.homeoffice.gov.uk/servicedesk/customer/portal/3/">
          COP Service Support Desk
        </a>{' '}
        if you have any questions.
      </p>
      <h3
        className="govuk-heading-s"
      >
        Support hours
      </h3>
      <p>Monday to Friday: 8am to 6pm </p>
    </div>
  </div>
);

export default UnsupportedPage;
