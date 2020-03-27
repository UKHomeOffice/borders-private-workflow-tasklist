import React from 'react';

const NotFound = ({ resource, id }) => {
  return (
    <div>
      <h4 className="govuk-heading-s">{resource} with identifier {id} was not found</h4>
    </div>
);
};

export default NotFound;
