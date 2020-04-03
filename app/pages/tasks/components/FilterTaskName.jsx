import React from 'react';

const FilterTaskName = ({filterValue, filterTasksByName}) => {
  return  (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor="filterTaskName">Search by task name:</label>
      <input
        className="govuk-input govuk-!-width-full"
        id="filterTaskName"
        type="text"
        name="filterTaskName"
        onChange={filterTasksByName}
        defaultValue={filterValue}
      />
    </div>
)
};

export default FilterTaskName;
