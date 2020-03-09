import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { debounce, throttle } from 'throttle-debounce';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import * as taskActions from '../../task/display/actions';
import { yourGroupTasks } from '../selectors';
import DataSpinner from '../../../core/components/DataSpinner';
import YourGroupTasks from './YourGroupTasks';
import AppConstants from '../../../common/AppConstants';
import {
  claimSuccessful,
  unclaimSuccessful,
} from '../../task/display/selectors';
import secureLocalStorage from '../../../common/security/SecureLocalStorage';
import TaskUtils from './TaskUtils';

export class YourGroupTasksContainer extends React.Component {
  constructor(props) {
    super(props);
    this.goToTask = this.goToTask.bind(this);
    this.sortYourGroupTasks = this.sortYourGroupTasks.bind(this);
    this.filterTasksByName = this.filterTasksByName.bind(this);
    this.debounceSearch = this.debounceSearch.bind(this);
    this.taskUtils = new TaskUtils();
  }

  componentDidMount() {
    this.loadYourGroupTasks(false, 'sort=due,desc');
    const that = this;
    this.timeoutId = setInterval(() => {
      const { yourGroupTasks } = that.props;
      this.loadYourGroupTasks(
        true,
        yourGroupTasks.get('yourGroupTasksSortValue'),
        yourGroupTasks.get('yourGroupTasksFilterValue'),
      );
    }, AppConstants.ONE_MINUTE);

    if (secureLocalStorage.get('yourTeamTasksGrouping')) {
      this.props.groupYourTeamTasks(
        secureLocalStorage.get('yourTeamTasksGrouping'),
      );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.unclaimSuccessful !== this.props.unclaimSuccessful &&
      this.props.unclaimSuccessful &&
      this.selectedTask
    ) {
      this.props.handleUnclaim(this.selectedTask);
    }

    if (this.props.claimSuccessful && this.selectedTask) {
      this.goToTask(this.selectedTask);
    }
  }

  componentWillUnmount() {
    this.selectedTask = null;
    clearTimeout(this.timeoutId);
  }

  goToTask(taskId) {
    this.props.history.replace(`/task/${taskId}?from=yourGroupTasks`);
  }

  loadYourGroupTasks(
    skipLoading,
    yourGroupTasksSortValue,
    yourGroupTasksFilterValue = null,
  ) {
    this.props.fetchYourGroupTasks(
      yourGroupTasksSortValue,
      yourGroupTasksFilterValue,
      skipLoading,
    );
  }

  debounceSearch(sortValue, filterValue) {
    if (filterValue.length <= 2 || filterValue.endsWith(' ')) {
      throttle(200, () => {
        this.props.fetchYourGroupTasks(sortValue, filterValue, true);
      })();
    } else {
      debounce(500, () => {
        this.props.fetchYourGroupTasks(sortValue, filterValue, true);
      })();
    }
  }

  filterTasksByName(event) {
    event.persist();
    const { yourGroupTasks } = this.props;
    this.debounceSearch(
      yourGroupTasks.get('yourGroupTasksSortValue'),
      event.target.value,
    );
  }

  sortYourGroupTasks(event) {
    this.props.fetchYourGroupTasks(
      event.target.value,
      this.props.yourGroupTasks.get('yourGroupTasksFilterValue'),
      true,
    );
  }

  render() {
    const { yourGroupTasks } = this.props;
    if (yourGroupTasks.get('isFetchingYourGroupTasks')) {
      return <DataSpinner message="Fetching your group tasks" />;
    }
    const groupBy = yourGroupTasks.get('groupBy');

    return (
      <YourGroupTasks
        grouping={groupBy}
        total={yourGroupTasks.get('total')}
        sortValue={yourGroupTasks.get('sortValue')}
        filterValue={yourGroupTasks.get('yourTasksFilterValue')}
        filterTasksByName={this.filterTasksByName}
        yourGroupTasks={this.taskUtils.applyGrouping(
          groupBy,
          yourGroupTasks.get('tasks').toJS(),
        )}
        sortYourGroupTasks={this.sortYourGroupTasks}
        userId={this.props.kc.tokenParsed.email}
        goToTask={this.goToTask}
        groupTasks={grouping => {
          secureLocalStorage.set('yourTeamTasksGrouping', grouping);
          this.props.groupYourTeamTasks(grouping);
        }}
        claimTask={taskId => {
          if (this.selectedTask) {
            this.selectedTask = null;
          }
          this.selectedTask = taskId;
          this.props.claimTask(taskId);
        }}
        handleUnclaim={taskId => {
          if (this.selectedTask) {
            this.selectedTask = null;
          }
          this.selectedTask = taskId;
          this.props.unclaimTask(taskId);
        }}
      />
    );
  }
}

YourGroupTasksContainer.propTypes = {
  groupYourTeamTasks: PropTypes.func,
  handleUnclaim: PropTypes.func,
  unclaimTask: PropTypes.func,
  fetchYourGroupTasks: PropTypes.func.isRequired,
  yourGroupTasks: ImmutablePropTypes.map,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign(taskActions, actions), dispatch);

export default connect(
  state => ({
    yourGroupTasks: yourGroupTasks(state),
    unclaimSuccessful: unclaimSuccessful(state),
    claimSuccessful: claimSuccessful(state),
    kc: state.keycloak,
  }),
  mapDispatchToProps,
)(withRouter(YourGroupTasksContainer));
