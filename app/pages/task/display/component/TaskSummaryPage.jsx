import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

// local imports
import Actions from './Actions';
import TaskTitle from './TaskTitle';

const TaskSummaryPage = props => {
    const {task, variables} = props;

    return (
      <React.Fragment>
        <TaskTitle {...props} />
        <div className="govuk-grid-row govuk-!-padding-top-3">
          <div className="govuk-grid-column-full ">
            <p className="govuk-body-l">{task.get('description')}</p>
            <Actions task={task} variables={variables} />
          </div>
        </div>
      </React.Fragment>
    );
};

TaskSummaryPage.propTypes = {
    candidateGroups: ImmutablePropTypes.list.isRequired,
    task: ImmutablePropTypes.map.isRequired,
    variables: PropTypes.any,
};

TaskSummaryPage.defaultProps = {
    variables: null,
};

export default TaskSummaryPage;
