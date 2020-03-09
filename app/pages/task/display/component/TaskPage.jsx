import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router';
import DataSpinner from '../../../../core/components/DataSpinner';
import NotFound from '../../../../core/components/NotFound';
import AppConstants from '../../../../common/AppConstants';
import {
  businessKey,
  candidateGroups,
  processDefinition,
  isFetchingTask,
  task,
  variables,
  extensionData,
} from '../selectors';
import * as actions from '../actions';
import TaskSummaryPage from './TaskSummaryPage';
import TaskDetailsPage from './TaskDetailsPage';

class TaskPage extends React.Component {
  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.taskId = params.taskId;
    this.props.fetchTask(this.taskId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { task } = this.props;
    if (prevProps.taskId !== this.props.taskId) {
      this.props.fetchTask(this.props.taskId);
    }
    if (task && task !== prevProps.task) {
      document.title = `${
        task.isEmpty() ? 'Task not found' : task.get('name')
      } | ${AppConstants.APP_NAME}`;
    }
  }

  componentWillUnmount() {
    this.taskId = null;
    this.props.clearTask();
  }

  render() {
    const { task, isFetchingTask, location } = this.props;
    if (isFetchingTask) {
      return <DataSpinner message="Fetching task information" />;
    }
    if (task.isEmpty()) {
      return <NotFound resource="Task" id={this.taskId} />;
    }
    const { from } = queryString.parse(location.search);
    return from ? (
      <React.Fragment>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <a
              href={AppConstants.DASHBOARD_PATH}
              style={{ textDecoration: 'none' }}
              className="govuk-back-link govuk-!-font-size-19"
              onClick={event => {
                event.preventDefault();
                if (from === 'yourTasks') {
                  this.props.history.replace(AppConstants.YOUR_TASKS_PATH);
                } else {
                  this.props.history.replace(
                    AppConstants.YOUR_GROUP_TASKS_PATH,
                  );
                }
              }}
            >
              Back to your {from === 'yourTasks' ? 'tasks' : 'team tasks'}{' '}
            </a>
          </div>
        </div>
        {task.get('assignee') &&
        task.get('assignee') === this.props.kc.tokenParsed.email ? (
          <TaskDetailsPage {...this.props} />
        ) : (
          <TaskSummaryPage {...this.props} />
        )}
      </React.Fragment>
    ) : task.get('assignee') &&
      task.get('assignee') === this.props.kc.tokenParsed.email ? (
      <TaskDetailsPage {...this.props} />
    ) : (
      <TaskSummaryPage {...this.props} />
    );
  }
}

TaskPage.propTypes = {
  fetchTask: PropTypes.func.isRequired,
  clearTask: PropTypes.func.isRequired,
  isFetchingTask: PropTypes.bool,
  task: ImmutablePropTypes.map,
  businessKey: PropTypes.string,
  processDefinition: ImmutablePropTypes.map,
  extensionData: ImmutablePropTypes.map,
};

const mapStateToProps = createStructuredSelector({
  isFetchingTask: isFetchingTask,
  task: task,
  candidateGroups: candidateGroups,
  variables: variables,
  businessKey: businessKey,
  processDefinition: processDefinition,
  extensionData: extensionData,
  kc: state => state.keycloak,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TaskPage),
);
