import * as types from 'react-device-detect';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import ReactHyperResponsiveTable from 'react-hyper-responsive-table';
import moment from 'moment';

// local imports
import './YourGroupTasks.scss';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';

const YourGroupTasks = props => {
    const {
        claimTask,
        filterTasksByName,
        goToTask,
        handleUnclaim,
        sortYourGroupTasks,
        userId,
        yourGroupTasks,
    } = props;
    let groupedTasks = [];
    // mobile headers
    let headers = {name: null, action: null};

    if (yourGroupTasks && yourGroupTasks.get('tasks')) {
        groupedTasks = _.groupBy(yourGroupTasks.get('tasks').toJS(), data => {
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

    // desktop headers
    if (!types.isMobile) {
        headers = {
            name: null,
            due: null,
            assignee: null,
            action: null,
        };
    }

    const dataToDisplay = _.map(sortedData, (value, key) => {
        const data = _.map(value, val => {
            const {task} = val;
            const claimButton = <button type="submit" id="actionButton" className="govuk-button"
                                        onClick={() => claimTask(task.id)}>Claim</button>;
            const toView = <a href={`${AppConstants.TASK_PATH}/${task.id}`} style={{textDecoration: 'underline'}}
                              className="govuk-link govuk-!-font-size-19" onClick={(e) => {
                e.preventDefault();
                goToTask(task.id)
            }}>{task.name}</a>;
            const unclaimButton = <button type="submit" id="actionButton" className="govuk-button" onClick={() => {
                handleUnclaim(task.id);
            }}>Unclaim</button>;
            let assignee = '';

            // unassigned task
            if (task.assignee === null) {
                assignee = <div className="govuk-!-font-size-19">Unassigned</div>;
            } else if (task.assignee === userId) { // task assigned to current user
                assignee = <div className="govuk-!-font-size-19">Assigned to you</div>;
            } else { // task assigned to a user
                assignee = <div className="govuk-!-font-size-19">{task.assignee}</div>;
            }

            // datetime format
            const utcDateTime = moment.utc(task.due).format();
            const localDateTime = moment(utcDateTime).local().format();
            const dueDateTime = moment().to(localDateTime);

            // mobile phone users
            if (types.isMobile) {
                return {
                    id: task.id,
                    name: toView,
                    action: task.assignee === null || task.assignee !== userId ? claimButton : unclaimButton,
                };
            }
            // desktop users
            return {
                id: task.id,
                name: toView,
                due: <div className="govuk-!-font-size-19">{`due ${dueDateTime}`}</div>,
                action: task.assignee === null || task.assignee !== userId ? claimButton : unclaimButton,
                assignee,
            };
        });

        const tasks = value.length === 1 ? 'task' : 'tasks';

        return (
            <div key={`category::${key}`} className="tasksGrouping">
                <div style={{paddingBottom: '5px'}} className="data-item govuk-!-font-size-19 govuk-!-font-weight-bold"
                     key={key}>
                    {key} {tasks}
                </div>
                <ReactHyperResponsiveTable
                    key={`category::${key}`}
                    headers={headers}
                    rows={data}
                    keyGetter={row => row.id}
                    breakpoint={578}
                    tableStyling={({narrow}) => (narrow ? 'narrowtable-yourgrouptasks' : 'widetable-yourgrouptasks')}
                />
            </div>
        );
    });

    let totalTasks = yourGroupTasks.get('total');
    totalTasks = totalTasks === 1 ? `${totalTasks} task` : `${totalTasks} tasks`;

    return (
        <div className="govuk-!-padding-top-3">
            <div className="data" id="yourGroupTasksTotalCount">
          <span className="data-item govuk-!-font-size-24 govuk-!-font-weight-bold">
            {totalTasks} allocated to your team
          </span>
            </div>
            <div className="govuk-grid-row govuk-!-padding-top-3">
                <div className="govuk-grid-column-one-half">
                    <SortTasks tasks={yourGroupTasks} sortTasks={sortYourGroupTasks}/>
                </div>
                <div className="govuk-grid-column-one-half">
                    <FilterTaskName tasks={yourGroupTasks} filterTasksByName={filterTasksByName}/>
                </div>
            </div>
            {dataToDisplay}
        </div>
    );
};

YourGroupTasks.propTypes = {
    claimTask: PropTypes.func.isRequired,
    filterTasksByName: PropTypes.func.isRequired,
    goToTask: PropTypes.func.isRequired,
    handleUnclaim: PropTypes.func.isRequired,
    sortYourGroupTasks: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    yourGroupTasks: ImmutablePropTypes.map.isRequired,
};

export default YourGroupTasks;
