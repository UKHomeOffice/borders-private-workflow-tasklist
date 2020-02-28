import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import './YourTasks.scss';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';

const YourTasks = props => {

    document.title = `Tasks assigned to you | ${AppConstants.APP_NAME}`;

    const {
        yourTasks,
        sortYourTasks,
        filterTasksByName,
        goToTask,
    } = props;
    let groupedTasks = [];

    if (yourTasks && yourTasks.get('tasks')) {
        groupedTasks = _.groupBy(yourTasks.get('tasks').toJS(), data => {
            const groupKey = data['process-definition'] ? data['process-definition'].category : 'Other';
            return groupKey;
        });
    }

    const sortByKeys = object => {
        const keys = Object.keys(object);
        const initialSort = _.sortBy(keys);
        const sortedKeys = _.sortBy(initialSort, key => (key === 'Other' ? 1 : 0));
        return _.fromPairs(_.map(sortedKeys, key => [key, object[key]]));
    };
    const sortedData = sortByKeys(groupedTasks);

    const dataToDisplay = _.map(sortedData, (value, key) => {
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
                            <span className="govuk-!-font-size-19">{task.name}</span>
                        </div>
                        <div className="govuk-grid-column-one-half">
                            <div className="govuk-grid-row">
                                <div className="govuk-grid-column-two-thirds">
                                    {
                                        moment(task.due).isAfter() ?  <div
                                            className={`govuk-!-font-size-19 govuk-!-font-weight-bold mb-3`} style={{color: '#00703c'}}>{`due ${dueLabel}`}</div>
                                             : <div
                                                className={`govuk-!-font-size-19 govuk-!-font-weight-bold mb-3`} style={{color: '#d4351c'}}>Overdue {dueLabel}</div>
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

    let totalTasks = yourTasks.get('total');
    totalTasks = totalTasks === 1 ? `${totalTasks} task` : `${totalTasks} tasks`;

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
                <div className="govuk-grid-row" style={{paddingTop: '10px'}}>
                    <div className="govuk-grid-column-one-half">
                        <SortTasks tasks={yourTasks} sortTasks={sortYourTasks}/>
                    </div>
                    <div className="govuk-grid-column-one-half">
                        <FilterTaskName tasks={yourTasks} filterTasksByName={filterTasksByName}/>
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
    yourTasks: ImmutablePropTypes.map.isRequired,
};

export default YourTasks;
