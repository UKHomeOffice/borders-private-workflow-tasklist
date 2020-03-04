import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map, List } = Immutable;

export const initialState = new Map({
    yourTasks: new Map({
        isFetchingTasksAssignedToYou: false,
        tasks: new List([]),
        total: 0,
        yourTasksSortValue: 'sort=due,desc',
        yourTasksFilterValue: null,
        groupBy: 'category',
    }),
    yourGroupTasks: new Map({
        isFetchingYourGroupTasks: false,
        tasks: new List([]),
        total: 0,
        yourGroupTasksSortValue: 'sort=due,desc',
        yourGroupTasksFilterValue: null,
        groupBy: 'category',
    }),
});

function reducer(state = initialState, action) {
  switch (action.type) {
    // tasks assigned to you
    case actions.FETCH_TASKS_ASSIGNED_TO_YOU:
      return state
        .setIn(['yourTasks', 'isFetchingTasksAssignedToYou'], !action.skipLoading)
        .setIn(['yourTasks', 'yourTasksFilterValue'], action.filterValue)
        .setIn(['yourTasks', 'yourTasksSortValue'], action.sortValue);
    case actions.FETCH_TASKS_ASSIGNED_TO_YOU_SUCCESS: {
      const embedded = action.payload.entity._embedded;
      const tasks = embedded ? embedded.tasks : [];
      return state
        .setIn(['yourTasks', 'isFetchingTasksAssignedToYou'], false)
        .setIn(['yourTasks', 'tasks'], Immutable.fromJS(tasks))
        .setIn(['yourTasks', 'total'], action.payload.entity.page.totalElements);
    }
    case actions.FETCH_TASKS_ASSIGNED_TO_YOU_FAILURE:
      return state
        .setIn(['yourTasks', 'isFetchingTasksAssignedToYou'], false);

    // tasks for your group
    case actions.FETCH_YOUR_GROUP_TASKS:
      return state
        .setIn(['yourGroupTasks', 'isFetchingTasksAssignedToYou'], !action.skipLoading)
        .setIn(['yourGroupTasks', 'yourGroupTasksFilterValue'], action.filterValue)
        .setIn(['yourGroupTasks', 'yourGroupTasksSortValue'], action.sortValue);
    case actions.FETCH_YOUR_GROUP_TASKS_SUCCESS: {
      const embedded = action.payload.entity._embedded;
      const groupTasks = embedded ? embedded.tasks : [];
      const groupTasksTotal = action.payload.entity.page.totalElements;
      return state.setIn(['yourGroupTasks', 'isFetchingYourGroupTasks'], false)
        .setIn(['yourGroupTasks', 'tasks'], Immutable.fromJS(groupTasks))
        .setIn(['yourGroupTasks', 'total'], groupTasksTotal);
    }
    case actions.FETCH_YOUR_GROUP_TASKS_FAILURE:
      return state.setIn(['yourGroupTasks', 'isFetchingYourGroupTasks'], false);

    case actions.HANDLE_UNCLAIM: {
      let yourGroupTasks = state.getIn(['yourGroupTasks', 'tasks']);
      const { taskId } = action;
      const findIndex = yourGroupTasks.findIndex(item => item.get('task').get('id') === taskId);
      yourGroupTasks = yourGroupTasks.update(
        findIndex, item => item.setIn(['task', 'assignee'], null),
      );

            return state.setIn(['yourGroupTasks', 'tasks'], yourGroupTasks);
        }
        case actions.RESET_YOUR_TASKS:
            return state.setIn(['yourTasks', 'tasks'], new List([]))
                .setIn(['yourTasks', 'total'], 0)
                .setIn(['yourTasks', 'yourTasksSortValue'], 'sort=due,desc')
                .setIn(['yourTasks', 'yourTasksFilterValue'], null);

        case actions.GROUP_YOUR_TASKS :
            return state.setIn(['yourTasks', 'groupBy'], action.groupBy);

        case actions.GROUP_YOUR_TEAM_TASKS :
            return state.setIn(['yourGroupTasks', 'groupBy'], action.groupBy);
        default:
            return state;
    }
}

export default reducer;
