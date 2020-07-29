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

  componentWillUnmount() {
    if (this.subToken) {
      PubSub.unsubscribe(this.subToken);
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
      <React.Fragment>
        <li className="govuk-grid-column-one-third" id="yourTasksPanel">
          <a
            href={AppConstants.YOUR_TASKS_PATH}
            className="govuk-heading-m govuk-link home-promo__link"
            id="yourTasksPageLink"
            onClick={e => this.yourTasks(e)}
          >
            {
            isFetchingTaskCounts 
            ? ( <span>Loading</span> ) 
            : ( <span id="yourTaskCount">{taskCounts.get('tasksAssignedToUser')}</span>)
            }
            <span> tasks assigned to you</span>
          </a>
          <p className="govuk-body-s">Tasks assigned to you</p>
        </li>
        <li className="govuk-grid-column-one-third" id="youTeamTasks">
          <a
            href={AppConstants.YOUR_GROUP_TASKS_PATH}
            className="govuk-heading-m govuk-link home-promo__link"
            id="yourTeamTasksPageLink"
            onClick={e => this.yourTeamTotalTasks(e)}
          >
            {
            isFetchingTaskCounts 
            ? ( <span>Loading</span>) 
            : ( <span id="yourGroupTaskCount">{taskCounts.get('totalTasksAllocatedToTeam')}</span>)
            }
            <span> tasks assigned to your team</span>
          </a>
          <p className="govuk-body-s">Overall tasks assigned to your team</p>
        </li>
      </React.Fragment>
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
