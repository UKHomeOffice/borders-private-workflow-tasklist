import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';
import TaskUtils from './TaskUtils';
import GroupTasks from './GroupTasks';
import '../../../core/components/Pagination.scss';
import TaskPagination from "./TaskPagination";

const taskUtils = new TaskUtils();
const YourTasks = props => {
  const {
    yourTasks,
    sortYourTasks,
    filterTasksByName,
    goToTask,
    groupTasks,
    total,
    sortValue,
    filterValue,
    grouping,
    paginationActions
  } = props;

  const dataToDisplay = _.map(yourTasks, (value, key) => {
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
                    <div className="govuk-grid-column-two-thirds govuk-!-margin-bottom-3">
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
                    <div className="govuk-grid-column-one-third text-right">
                      <button
                        id="actionButton"
                        className="govuk-button"
                        onClick={() => goToTask(task.id)}
                        type="submit"
                      >
                        Action
                      </button>
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
          <div className="govuk-grid-column-one-half" id="yourTasksTotalCount">
            <span className="govuk-caption-l">Your tasks</span>
            <h2 className="govuk-heading-l">
              {totalTasks} assigned to you
            </h2>
          </div>
        </div>
        <div className="govuk-grid-row govuk-!-padding-top-3">
          <div className="govuk-grid-column-two-thirds">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-half">
                <SortTasks sortValue={sortValue} sortTasks={sortYourTasks} />
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

YourTasks.defaultProps = {
  paginationActions: {
    onFirst: null,
    onPrev: null,
    onNext: null,
    onLast: null
  },
  yourTasks: {},
  total: 0,
  groupTasks: () => {},
  sortValue: '',
  filterValue: '',
  grouping: 'category'
};

YourTasks.propTypes = {
  filterTasksByName: PropTypes.func.isRequired,
  goToTask: PropTypes.func.isRequired,
  sortYourTasks: PropTypes.func.isRequired,
  yourTasks: PropTypes.object,
  paginationActions: PropTypes.shape({
    onFirst: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onLast: PropTypes.func
  }),
  total: PropTypes.number,
  groupTasks: PropTypes.func,
  sortValue: PropTypes.string,
  filterValue: PropTypes.string,
  grouping: PropTypes.string
};

export default YourTasks;
