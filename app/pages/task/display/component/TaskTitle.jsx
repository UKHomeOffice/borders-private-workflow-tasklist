import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { priority } from '../../../../core/util/priority';

const TaskTitle = props => {
  const { kc, task, businessKey, processDefinition } = props;
  const taskPriority = priority(task.get('priority'));
  let assignee = 'You are the current assignee';

  if (!task.get('assignee')) {
    assignee = 'Unassigned';
  } else if (
    task.get('assignee') &&
    task.get('assignee') !== kc.tokenParsed.email
  ) {
    assignee = kc.tokenParsed.email;
  }
  const due = moment(task.get('due'));
  const dueLabel = moment().to(due);
  return (
    <React.Fragment>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="taskName">
          <h1 className="govuk-heading-l">
            <span className="govuk-caption-l">{businessKey}</span>
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
          <span className="govuk-caption-m govuk-!-font-size-19">Due</span>

          {moment(task.due).isAfter() ? (
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
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskPriority">
          <span className="govuk-caption-m govuk-!-font-size-19">Priority</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            {taskPriority}
          </h4>
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
