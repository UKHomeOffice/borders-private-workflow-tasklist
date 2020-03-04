import * as types from './actionTypes';

const fetchTasksAssignedToYou = (sortValue, filterValue, skipLoading) => ({
  type: types.FETCH_TASKS_ASSIGNED_TO_YOU,
  sortValue,
  filterValue,
  skipLoading,
});

const fetchTasksAssignedToYouSuccess = payload => ({
  type: types.FETCH_TASKS_ASSIGNED_TO_YOU_SUCCESS,
  payload,
});

const fetchTasksAssignedToYouFailure = () => ({
  type: types.FETCH_TASKS_ASSIGNED_TO_YOU_FAILURE,
});

const resetYourTasks = () => ({
  type: types.RESET_YOUR_TASKS,
});
const fetchYourGroupTasks = (sortValue, filterValue, skipLoading) => ({
  type: types.FETCH_YOUR_GROUP_TASKS,
  sortValue,
  filterValue,
  skipLoading,
});

const fetchYourGroupTasksSuccess = payload => ({
  type: types.FETCH_YOUR_GROUP_TASKS_SUCCESS,
  payload,
});

const fetchYourGroupTasksFailure = () => ({
  type: types.FETCH_YOUR_GROUP_TASKS_FAILURE,
});

const handleUnclaim = taskId => ({
  type: types.HANDLE_UNCLAIM,
  taskId,
});

const groupYourTasks = groupBy => ({
    type: types.GROUP_YOUR_TASKS,
    groupBy
});

const groupYourTeamTasks = groupBy => ({
    type: types.GROUP_YOUR_TEAM_TASKS,
    groupBy
});

export {
    fetchTasksAssignedToYou,
    fetchTasksAssignedToYouSuccess,
    fetchTasksAssignedToYouFailure,
    fetchYourGroupTasks,
    fetchYourGroupTasksSuccess,
    fetchYourGroupTasksFailure,
    handleUnclaim,
    resetYourTasks,
    groupYourTasks,
    groupYourTeamTasks
};
