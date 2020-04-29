import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { debounce, throttle } from 'throttle-debounce';
import { withRouter } from 'react-router';
import {List} from "immutable";
import * as actions from '../actions';
import * as taskActions from '../../task/display/actions';
import DataSpinner from '../../../core/components/DataSpinner';
import YourGroupTasks from './YourGroupTasks';
import AppConstants from '../../../common/AppConstants';
import {
  claimSuccessful,
  unclaimSuccessful,
} from '../../task/display/selectors';
import secureLocalStorage from '../../../common/security/SecureLocalStorage';
import TaskUtils from './TaskUtils';
import {
  isFetchingTasksSelector,
  tasksSelector,
  totalSelector,
  sortValueSelector,
  filterValueSelector,
  groupBySelector,
  nextPageUrlSelector,
  prevPageUrlSelector,
  firstPageUrlSelector,
  lastPageUrlSelector
} from "../selectors";

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
    const {groupYourTeamTasks} = this.props;
    this.timeoutId = setInterval(() => {
      const { sortValue:sort, filterValue:filter } = that.props;
      this.loadYourGroupTasks(
        true,
        sort,
        filter,
      );
    }, AppConstants.REFRESH_TIMEOUT);

    if (secureLocalStorage.get('yourTeamTasksGrouping')) {
      groupYourTeamTasks(
        secureLocalStorage.get('yourTeamTasksGrouping'),
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    // eslint-disable-next-line no-shadow
    const {unclaimSuccessful, claimSuccessful, handleUnclaim} = this.props;
    if (
      prevProps.unclaimSuccessful !== unclaimSuccessful &&
      unclaimSuccessful &&
      this.selectedTask
    ) {
      handleUnclaim(this.selectedTask);
    }

    if (claimSuccessful && this.selectedTask) {
      this.goToTask(this.selectedTask);
    }
  }

  componentWillUnmount() {
    this.selectedTask = null;
    clearTimeout(this.timeoutId);
  }

  goToTask(taskId) {
    const {history} = this.props;
    history.replace(`/task/${taskId}?from=yourGroupTasks`);
  }

  loadYourGroupTasks(
    skipLoading,
    yourGroupTasksSortValue,
    yourGroupTasksFilterValue = null,
  ) {
    const { fetchYourGroupTasks } = this.props;
    fetchYourGroupTasks(
      yourGroupTasksSortValue,
      yourGroupTasksFilterValue,
      skipLoading,
    );
  }

  debounceSearch(sort, filter) {
    const {fetchYourGroupTasks} = this.props;
    if (filter.length <= 2 || filter.endsWith(' ')) {
      throttle(200, () => {
       fetchYourGroupTasks(sort, filter, true);
      })();
    } else {
      debounce(500, () => {
        fetchYourGroupTasks(sort, filter, true);
      })();
    }
  }

  filterTasksByName(event) {
    event.persist();
    const { sortValue:sort } = this.props;
    this.debounceSearch(
        sort,
      event.target.value,
    );
  }

  sortYourGroupTasks(event) {
    const {fetchYourGroupTasks, filterValue:filter} = this.props;
    fetchYourGroupTasks(
      event.target.value,
      filter,
      true,
    );
  }


  render() {
    const { isFetchingTasks, groupBy, tasks, total, sortValue, filterValue, kc,
      groupYourTeamTasks, claimTask, unclaimTask } = this.props;

    const {tokenParsed} = kc;
    if (isFetchingTasks) {
      return <DataSpinner message="Fetching your group tasks" />;
    }

    return (
      <YourGroupTasks
        grouping={groupBy}
        total={total}
        sortValue={sortValue}
        filterValue={filterValue}
        paginationActions={
          this.taskUtils.buildPaginationAction(this.props)
        }
        filterTasksByName={this.filterTasksByName}
        yourGroupTasks={this.taskUtils.applyGrouping(
          groupBy,
          tasks.toJS(),
        )}
        sortYourGroupTasks={this.sortYourGroupTasks}
        userId={tokenParsed.email}
        goToTask={this.goToTask}
        groupTasks={grouping => {
          secureLocalStorage.set('yourTeamTasksGrouping', grouping);
          groupYourTeamTasks(grouping);
        }}
        claimTask={taskId => {
          if (this.selectedTask) {
            this.selectedTask = null;
          }
          this.selectedTask = taskId;
          claimTask(taskId);
        }}
        handleUnclaim={taskId => {
          if (this.selectedTask) {
            this.selectedTask = null;
          }
          this.selectedTask = taskId;
          unclaimTask(taskId);
        }}
      />
    );
  }
}

YourGroupTasksContainer.defaultProps = {
  isFetchingTasks: true,
  unclaimSuccessful: false,
  claimSuccessful: false,
  tasks: new List([]),
  total: 0,
  sortValue: 'sort=due,desc',
  filterValue: null,
  groupBy: 'category'
};



YourGroupTasksContainer.propTypes = {
  kc: PropTypes.shape({
    tokenParsed: PropTypes.shape({
      email: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.any.isRequired,
  groupYourTeamTasks: PropTypes.func.isRequired,
  handleUnclaim: PropTypes.func.isRequired,
  claimSuccessful: PropTypes.bool,
  unclaimSuccessful: PropTypes.bool,
  unclaimTask: PropTypes.func.isRequired,
  fetchYourGroupTasks: PropTypes.func.isRequired,
  isFetchingTasks: PropTypes.bool,
  claimTask: PropTypes.func.isRequired,
  tasks: ImmutablePropTypes.list,
  total: PropTypes.number,
  sortValue: PropTypes.string,
  filterValue: PropTypes.string,
  groupBy: PropTypes.string
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign(taskActions, actions), dispatch);

export default connect(
  state => ({
    isFetchingTasks: isFetchingTasksSelector(state),
    tasks: tasksSelector(state),
    total: totalSelector(state),
    sortValue: sortValueSelector(state),
    filterValue: filterValueSelector(state),
    groupBy: groupBySelector(state),
    nextPageUrl: nextPageUrlSelector(state),
    prevPageUrl: prevPageUrlSelector(state),
    firstPageUrl: firstPageUrlSelector(state),
    lastPageUrl: lastPageUrlSelector(state),
    unclaimSuccessful: unclaimSuccessful(state),
    claimSuccessful: claimSuccessful(state),
    kc: state.keycloak,
  }),
  mapDispatchToProps,
)(withRouter(YourGroupTasksContainer));
