import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import './YourTasks.scss';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';

const caption = (grouping, val) => {
    let caption;
    switch (grouping) {
        case 'category':
        case 'priority':
            caption= val.businessKey;
            break;
        case 'reference':
            caption = val['process-definition'].category;
            break;
        default:
            caption = '';

    }
    return caption;
}
const YourTasks = props => {

    document.title = `Tasks assigned to you | ${AppConstants.APP_NAME}`;

    const {
        yourTasks,
        sortYourTasks,
        filterTasksByName,
        goToTask,
        groupTasks,
        total,
        sortValue,
        filterValue,
        grouping = 'category'
    } = props;

    const dataToDisplay = _.map(yourTasks, (value, key) => {
        const tasks = value.length === 1 ? 'task' : 'tasks';
        return <div id="taskGroups" key={key} className="govuk-grid-row">
            <div className="govuk-grid-column-full">
                <h3 className="govuk-heading-m">{key} ({value.length} {tasks})</h3>
                {_.map(value, val => {
                    const {task} = val;
                    const due = moment(task.due);
                    const dueLabel = moment().to(due);
                    return <div key={task.id} className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half">

                            <span className="govuk-caption-m">{caption(grouping, val)}</span>
                            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">{task.name}</span>
                        </div>
                        <div className="govuk-grid-column-one-half">
                            <div className="govuk-grid-row">
                                <div className="govuk-grid-column-two-thirds govuk-!-margin-bottom-3">
                                    {
                                        moment(task.due).isAfter() ? <span aria-label={`due ${dueLabel}`}
                                                                           className={`govuk-!-font-size-19 govuk-!-font-weight-bold not-over-due-date`}
                                                                           >{`Due ${dueLabel}`}</span>
                                            : <span aria-label={`Urgent overdue ${dueLabel}`}
                                                    className={`govuk-!-font-size-19 govuk-!-font-weight-bold over-due-date`}
                                                    >Overdue {dueLabel}</span>
                                    }

                                </div>
                                <div className="govuk-grid-column-one-third text-right">
                                    <button id="actionButton" className="govuk-button" onClick={() => goToTask(task.id)}
                                            type="submit">Action
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                })}
                <hr style={{
                    borderBottom: '3px solid #1d70b8',
                    borderTop: 'none'
                }}/>
            </div>

        </div>
    });


    const totalTasks = total === 1 ? `${total} task` : `${total} tasks`;
    console.log(yourTasks);
    return (
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-half" id="yourTasksTotalCount">
                      <span className="data-item govuk-!-font-size-24 govuk-!-font-weight-bold">
                        {totalTasks} assigned to you
                      </span>
                    </div>
                </div>
                <div className="govuk-grid-row govuk-!-padding-top-3">
                    <div className="govuk-grid-column-two-thirds">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-one-half">
                                <SortTasks sortValue={sortValue} sortTasks={sortYourTasks}/>
                            </div>
                            <div className="govuk-grid-column-one-half">
                                <div className="govuk-form-group">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="govuk-grid-column-one-third">
                        <FilterTaskName filterValue={filterValue} filterTasksByName={filterTasksByName}/>
                    </div>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        {dataToDisplay}
                    </div>
                </div>
            </div>
        </div>

    );
};

YourTasks.propTypes = {
    filterTasksByName: PropTypes.func.isRequired,
    goToTask: PropTypes.func.isRequired,
    sortYourTasks: PropTypes.func.isRequired,
    yourTasks: PropTypes.object,
};

export default YourTasks;
