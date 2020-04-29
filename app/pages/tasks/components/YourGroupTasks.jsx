import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';
import TaskUtils from './TaskUtils';
import GroupTasks from './GroupTasks';
import TaskPagination from "./TaskPagination";

const taskUtils = new TaskUtils();

const YourGroupTasks = props => {
  const {
    claimTask,
    yourGroupTasks,
    filterTasksByName,
    goToTask,
    handleUnclaim,
    sortYourGroupTasks,
    userId,
    total,
    groupTasks,
    grouping,
    sortValue,
    filterValue,
    paginationActions
  } = props;

  const dataToDisplay = _.map(yourGroupTasks, (value, key) => {
    const tasks = value.length === 1 ? 'task' : 'tasks';
    return (
      <div id="taskGroups" key={key} className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">
            {key} ({value.length} {tasks})
          </h3>
          {_.map(value, val => {
            const { task } = val;
            const due = moment(task.due);
            const dueLabel = moment().to(due);

            return (
              <div key={task.id} className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  <span className="govuk-caption-m">
                    {taskUtils.generateCaption(grouping, val)}
                  </span>
                  <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                    <a
                      href={`${AppConstants.TASK_PATH}/${task.id}`}
                      style={{ textDecoration: 'underline' }}
                      className="govuk-link govuk-!-font-size-19"
                      onClick={e => {
                        e.preventDefault();
                        goToTask(task.id);
                      }}
                    >
                      {task.name}
                    </a>
                  </span>
                </div>
                <div className="govuk-grid-column-one-half">
                  <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third govuk-!-margin-bottom-3">
                      {moment(task.due).isAfter() ? (
                        <span
                          aria-label={`due ${dueLabel}`}
                          className="govuk-!-font-size-19 govuk-!-font-weight-bold not-over-due-date"
                        >
                          {`Due ${dueLabel}`}
                        </span>
                      ) : (
                        <span
                          aria-label={`Urgent overdue ${dueLabel}`}
                          className="govuk-!-font-size-19 govuk-!-font-weight-bold over-due-date"
                        >
                          Overdue {dueLabel}
                        </span>
                      )}
                    </div>
                    <div className="govuk-grid-column-one-third govuk-!-margin-bottom-3">
                      {/* eslint-disable-next-line no-nested-ternary */}
                      {task.assignee === null ? (
                        <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                          Unassigned
                        </span>
                      ) : task.assignee === userId ? (
                        <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                          Assigned to you
                        </span>
                      ) : (
                        <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                          {task.assignee}
                        </span>
                      )}
                    </div>
                    <div className="govuk-grid-column-one-third text-right">
                      {task.assignee === null || task.assignee !== userId ? (
                        <button
                          type="submit"
                          id="actionButton"
                          className="govuk-button"
                          onClick={() => claimTask(task.id)}
                        >
                          Claim
                        </button>
                      ) : (
                        <button
                          type="submit"
                          id="actionButton"
                          className="govuk-button"
                          onClick={() => {
                            handleUnclaim(task.id);
                          }}
                        >
                          Unclaim
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <hr
            style={{
              borderBottom: '3px solid #1d70b8',
              borderTop: 'none',
            }}
          />
        </div>
      </div>
    );
  });
  const totalTasks = total === 1 ? `${total} task` : `${total} tasks`;
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <div className="govuk-grid-row">
          <div
            className="govuk-grid-column-one-half"
            id="yourGroupTasksTotalCount"
          >
            <span className="govuk-caption-l">Your team&rsquo;s tasks</span>
            <h2 className="govuk-heading-l">
              {totalTasks} assigned to your team
            </h2>
            <div className="govuk-inset-text">
              <strong>This page auto refreshes every 5 minutes</strong>
            </div>
          </div>

        </div>
        <div className="govuk-grid-row govuk-!-padding-top-3">
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-half">
                <SortTasks sortValue={sortValue} sortTasks={sortYourGroupTasks} />
              </div>
              <div className="govuk-grid-column-one-half">
                <GroupTasks groupTasks={groupTasks} grouping={grouping} />
              </div>
            </div>
          </div>
          <div className="govuk-grid-column-one-third">
            <FilterTaskName
              filterValue={filterValue}
              filterTasksByName={filterTasksByName}
            />
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">{dataToDisplay}</div>
        </div>
        { total !== 0 ? <TaskPagination {...{paginationActions}} /> : null}
      </div>
    </div>
  );
};

YourGroupTasks.defaultProps = {
  paginationActions: {
    onFirst: null,
    onPrev: null,
    onNext: null,
    onLast: null
  },
  yourGroupTasks: {},
  total: 0,
  groupTasks: () => {},
  sortValue: '',
  filterValue: '',
  grouping: 'category',
};

YourGroupTasks.propTypes = {
  paginationActions: PropTypes.shape({
    onFirst: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onLast: PropTypes.func
  }),
  total: PropTypes.number,
  groupTasks: PropTypes.func,
  claimTask: PropTypes.func.isRequired,
  filterTasksByName: PropTypes.func.isRequired,
  goToTask: PropTypes.func.isRequired,
  handleUnclaim: PropTypes.func.isRequired,
  sortYourGroupTasks: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  yourGroupTasks: PropTypes.object,
  grouping: PropTypes.string,
  sortValue: PropTypes.string,
  filterValue: PropTypes.string,
};

export default YourGroupTasks;
