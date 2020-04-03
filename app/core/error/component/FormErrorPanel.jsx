import React from 'react';
import uuid from 'uuid';
import parse from 'html-react-parser';

const FormErrorPanel = ({errors}) => {
    return errors && errors.length !== 0 ? (
      <div className="container">
        <div
          className="govuk-error-summary"
          aria-labelledby="error-summary-title"
          role="alert"
          tabIndex="-1"
          data-module="govuk-error-summary"
        >
          <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem with your form
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-error-summary__list">
              {errors.map(({message, instance}) => {
                            return (
                              <li key={uuid()}>
                                <a
                                  href=""
                                  onClick={e => {
                                    e.preventDefault();
                                    instance.focus();
                                }}
                                ><div>{parse(message)}</div>
                                </a>
                              </li>
)
                        })}
            </ul>
          </div>
        </div>
      </div>
)
        : null;
};


export default FormErrorPanel;
