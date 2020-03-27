import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import { isFetchingTaskCounts, taskCounts } from '../selectors';
import * as actions from '../actions';
import AppConstants from '../../../common/AppConstants';
import withLog from '../../../core/error/component/withLog';

export class TaskCountPanel extends React.Component {
  constructor(props) {
    super(props);
    this.yourTeamTotalTasks = this.yourTeamTotalTasks.bind(this);
    this.yourTasks = this.yourTasks.bind(this);
  }

  componentDidMount() {
    if (this.props.hasActiveShift) {
      this.subToken = PubSub.subscribe('refreshCount', (msg, data) => {
        const path = this.props.history.location.pathname;
        const user = this.props.kc.tokenParsed.email;
        this.props.log([
          {
            level: 'info',
            user,
            path,
            message: 'refreshing task count',
            data,
          },
        ]);
        this.props.fetchTaskCounts();
      });
      this.props.fetchTaskCounts();
    } else {
      this.props.setDefaultCounts();
    }
  }

  componentWillUnmount() {
    if (this.subToken) {
      PubSub.unsubscribe(this.subToken);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.isFetchingTaskCounts) {
      const path = this.props.history.location.pathname;
      const user = this.props.kc.tokenParsed.email;
      const taskCounts = this.props.taskCounts.toJSON();
      this.props.log([
        {
          level: 'info',
          user,
          path,
          message: 'task count loaded',
          taskCounts,
        },
      ]);
    }
  }

  yourTasks(e) {
    e.preventDefault();
    this.props.history.replace({
      pathname: AppConstants.YOUR_TASKS_PATH,
      state: { shiftPresent: this.props.hasActiveShift },
    });
  }

  yourTeamTotalTasks(e) {
    e.preventDefault();
    this.props.history.replace({
      pathname: AppConstants.YOUR_GROUP_TASKS_PATH,
      state: { shiftPresent: this.props.hasActiveShift },
    });
  }

  render() {
    const { taskCounts, isFetchingTaskCounts } = this.props;
    return (
      <div>
        <li className="__card govuk-grid-column-one-third" id="yourTasksPanel">
          <a
            href={AppConstants.YOUR_TASKS_PATH}
            onClick={this.yourTasks}
            className="card__body"
            id="yourTasksPageLink"
          >
            {isFetchingTaskCounts ? (
              <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                Loading
              </span>
            ) : (
              <span
                className="govuk-!-font-size-48 govuk-!-font-weight-bold"
                id="yourTaskCount"
              >
                {taskCounts.get('tasksAssignedToUser')}
              </span>
            )}
            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
              tasks assigned to you
            </span>
          </a>
          <div className="card__footer">
            <span className="govuk-!-font-size-19">Tasks assigned to you</span>
          </div>
        </li>
        <li className="__card govuk-grid-column-one-third" id="youTeamTasks">
          <a
            href={AppConstants.YOUR_GROUP_TASKS_PATH}
            onClick={this.yourTeamTotalTasks}
            className="card__body"
            id="yourTeamTasksPageLink"
          >
            {isFetchingTaskCounts ? (
              <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
                Loading
              </span>
            ) : (
              <span
                className="govuk-!-font-size-48 govuk-!-font-weight-bold"
                id="yourGroupTaskCount"
              >
                {taskCounts.get('totalTasksAllocatedToTeam')}
              </span>
            )}
            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
              tasks assigned to your team
            </span>
          </a>
          <div className="card__footer">
            <span className="govuk-!-font-size-19">
              Overall tasks assigned to your team
            </span>
          </div>
        </li>
      </div>
    );
  }
}

TaskCountPanel.propTypes = {
  log: PropTypes.func,
  fetchTaskCounts: PropTypes.func.isRequired,
  setDefaultCounts: PropTypes.func.isRequired,
  taskCounts: ImmutablePropTypes.map,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  state => ({
    taskCounts: taskCounts(state),
    isFetchingTaskCounts: isFetchingTaskCounts(state),
    kc: state.keycloak,
  }),
  mapDispatchToProps,
)(withRouter(withLog(TaskCountPanel)));
