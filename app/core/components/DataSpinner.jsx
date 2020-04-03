import React from 'react';
import Spinner from 'react-spinkit';
import './DataSpinner.scss';

const DataSpinner = ({ message }) => {
  return (
    <div id="dataSpinner">
      <div className="loader-content">
        <Spinner
          name="line-spin-fade-loader"
          color="black"
        />
      </div>
      <div className="loader-message"><strong className="govuk-!-font-weight-bold">
        {message}
                                      </strong>
      </div>
    </div>
);
};

export default DataSpinner;
