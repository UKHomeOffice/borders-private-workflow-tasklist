import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import moment from 'moment';
import {Link} from "react-router-dom";
import priority from '../../../../core/util/priority';
import AppConstants from '../../../../common/AppConstants';

const TaskTitle = props => {
  const { kc, task, businessKey, processDefinition, updateTask, isUpdatingTask, history} = props;
  const taskPriority = priority(task.get('priority'));
  let assignee = 'You are the current assignee';
  const [displayDateChange, setDisplayDateChange] = useState(false);
  const [displayPriorityChange, setDisplayPriorityChange] = useState(false);
  const [tPriority, setTPriority] = useState(task.get('priority'));

  if (!task.get('assignee')) {
    assignee = 'Unassigned';
  } else if (
      task.get('assignee') &&
      task.get('assignee') !== kc.tokenParsed.email
  ) {
    assignee = kc.tokenParsed.email;
  }
  const due = moment.utc(task.get('due')).local();
  const dueLabel = moment().to(due);
  const [dueDate, setDueDate] = useState({
    day: due.format('DD'),
    month: due.format('MM'),
    year: due.format('YYYY')
  });

  const updateField = e => {
    setDueDate({
      ...dueDate,
      [e.target.name.split('-')[1]]: e.target.value
    });
  };

  return (
    <React.Fragment>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="taskName">
          <span className="govuk-caption-l">
            <Link className="govuk-link" target="_blank" to={`/cases/${businessKey}`}>{businessKey}</Link>
          </span>
          <h1 className="govuk-heading-l">
            {task.get('name')}
          </h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter" id="category">
          <span className="govuk-caption-m govuk-!-font-size-19">Category</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            {processDefinition.get('category')}
          </h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskDueDate">
          <span className="govuk-caption-m govuk-!-font-size-19">Due (<a
            className="govuk-link"
            href="#"
            onClick={e => {
            e.preventDefault();
            setDisplayDateChange(!displayDateChange);
          }}
          >{displayDateChange ? 'cancel' : 'change'}
          </a>)
          </span>
          {displayDateChange ? (
            <div className="govuk-form-group">
              <div className="govuk-date-input" id="dueDate">
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="day">
                      Day
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="dueDate-day"
                      defaultValue={dueDate.day}
                      onChange={e => {
                             updateField(e)
                           }}
                      name="dueDate-day"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="dueDate-month">
                      Month
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      defaultValue={dueDate.month}
                      onChange={e => {
                             updateField(e)
                           }}
                      id="dueDate-month"
                      name="dueDate-month"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="dueDate-year">
                      Year
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-4"
                      id="dueDate-year"
                      name="dueDate-year"
                      type="text"
                      pattern="[0-9]*"
                      defaultValue={dueDate.year}
                      onChange={e => {
                             updateField(e)
                           }}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              <button
                className="govuk-button govuk-!-margin-top-3"
                data-module="govuk-button"
                disabled={isUpdatingTask}
                onClick={() => {
                updateTask({
                  taskId: task.get('id'),
                  priority: task.get('priority'),
                  dueDate: `${dueDate.day}-${dueDate.month}-${dueDate.year}`
                })
              }}
              >
                Change due date
              </button>
            </div>
): (
  <React.Fragment>
    {due.isAfter() ? (
      <h4
        aria-label={`due ${dueLabel}`}
        className="govuk-!-font-size-19 govuk-!-font-weight-bold not-over-due-date"
      >
        {`Due ${dueLabel}`}
      </h4>
              ) : (
                <h4
                  aria-label={`Urgent overdue ${dueLabel}`}
                  className="govuk-!-font-size-19 govuk-!-font-weight-bold over-due-date"
                >
                    Overdue {dueLabel}
                </h4>
              )}
  </React.Fragment>
)}

        </div>
        <div className="govuk-grid-column-one-quarter" id="taskPriority">
          <span className="govuk-caption-m govuk-!-font-size-19">Priority (<a
            className="govuk-link"

            onClick={e => {
                  e.preventDefault();
                  setDisplayPriorityChange(!displayPriorityChange)
                }}
            href="#"
          >{displayPriorityChange ? 'cancel' : 'change'}
          </a>)
          </span>
          {displayPriorityChange ? (
            <div className="govuk-form-group govuk-!-margin-top-2">
              <div>
                <select
                  className="govuk-select"
                  id="priority"
                  name="priority"
                  onChange={e => setTPriority(e.target.value)}
                  defaultValue={task.get('priority')}
                >
                  <option value={AppConstants.HIGH_PRIORITY_LOWER_LIMIT}>{AppConstants.HIGH_PRIORITY_LABEL}</option>
                  <option value={AppConstants.MEDIUM_PRIORITY_LOWER_LIMIT}>{AppConstants.MEDIUM_PRIORITY_LABEL}</option>
                  <option value={AppConstants.LOW_PRIORITY_UPPER_LIMIT}>{AppConstants.LOW_PRIORITY_LABEL}</option>
                </select>
              </div>
              <div>
                <button
                  className="govuk-button govuk-!-margin-top-2"
                  disabled={isUpdatingTask}
                  data-module="govuk-button"
                  onClick={() => {
                        updateTask({
                          taskId: task.get('id'),
                          priority: tPriority,
                          dueDate: due
                        })
                      }}
                >Change priority
                </button>
              </div>
            </div>
) : (
  <h4 className="govuk-heading-m govuk-!-font-size-19">
    {taskPriority}
  </h4>
)}
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskAssignee">
          <span className="govuk-caption-m govuk-!-font-size-19">Assignee</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{assignee}</h4>
        </div>
      </div>
    </React.Fragment>
  );
};

TaskTitle.propTypes = {
  kc: PropTypes.shape({
    tokenParsed: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  task: ImmutablePropTypes.map.isRequired,
};

export default TaskTitle;
