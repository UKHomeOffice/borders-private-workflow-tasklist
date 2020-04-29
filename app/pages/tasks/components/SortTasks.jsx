import React from 'react';
import * as types from 'react-device-detect';
import PropTypes from 'prop-types';

const SortTasks = ({sortValue, sortTasks}) => {
  return (
    <div className="govuk-form-group">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="govuk-label" htmlFor="sortTask">Sort tasks by:</label>
      <select
        className="govuk-select"
        id="sortTask"
        name="sortTask"
        onChange={sortTasks}
        style={types.isMobile?  {width: '100%'} : null}
        value={sortValue}
      >
        <option value="sort=due,desc">Latest due date</option>
        <option value="sort=due,asc">Oldest due date</option>
        <option value="sort=created,desc">Latest created date</option>
        <option value="sort=created,asc">Oldest created date</option>
        <option value="sort=priority,desc">Highest priority</option>
        <option value="sort=priority,asc">Lowest priority</option>
      </select>
    </div>
)};

SortTasks.propTypes = {
    sortValue: PropTypes.string.isRequired,
    sortTasks: PropTypes.func.isRequired
};

export default SortTasks;
