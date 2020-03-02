import React from 'react';
import PropTypes from "prop-types";

const GroupTasks = ({groupTasks, grouping}) => {
    return (<div className="govuk-form-group">
        <label className="govuk-label" htmlFor="groupBy">
            Group tasks by:
        </label>
        <select
            defaultValue={grouping}
            onChange={e => groupTasks(e.target.value)}
            className="govuk-select" id="groupBy" name="groupBy">
            <option value="category">Category</option>
            <option value="reference">BF Reference</option>
            <option value="priority">Priority</option>
        </select>
    </div>)
};

GroupTasks.propTypes = {
    groupTasks: PropTypes.func.isRequired,
    grouping: PropTypes.string,
};

export default GroupTasks;
