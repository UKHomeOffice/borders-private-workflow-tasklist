import Immutable from 'immutable';
import * as actions from './actionTypes';
import _ from 'lodash';
const { Map, List } = Immutable;

export const initialState = new Map({
    isFetchingTasks: false,
    tasks: new List([]),
    total: 0,
    sortValue: 'sort=due,desc',
    filterValue: null,
    groupBy: 'category',
    nextPageUrl: null,
    prevPageUrl: null,
    firstPageUrl: null,
    lastPageUrl: null
});

const resolve = (links, path) => {
    const link = _.get(links, path);
    const self =  _.get(links, 'self.href');
    if (link === self) {
        return undefined
    }
    return link;
};


const setData = (state, action) => {
    const {entity} = action.payload;
    // eslint-disable-next-line no-underscore-dangle
    const embedded = entity._embedded;
    const {page} = entity;
    const tasks = embedded ? embedded.tasks : [];
    let first;
    let prev;
    let next;
    let last;
    if (page.totalElements > page.size) {
        // eslint-disable-next-line no-underscore-dangle
        const links = entity._links;
        first = resolve(links, 'first.href');
        prev = _.get(links, 'prev.href');
        next = _.get(links,'next.href');
        last = resolve(links, 'last.href');
    }
    return state
        .set('isFetchingTasks', false)
        .set('tasks', Immutable.fromJS(tasks))
        .set('total', page.totalElements)
        .set('firstPageUrl', first)
        .set('prevPageUrl', prev)
        .set('nextPageUrl', next)
        .set('lastPageUrl', last);
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_TASKS_ASSIGNED_TO_YOU:
    case actions.FETCH_YOUR_GROUP_TASKS:
      return state
        .set('isFetchingTasks', !action.skipLoading)
        .set('sortValue', action.sortValue)
        .set('filterValue', action.filterValue);
    case actions.FETCH_TASKS_ASSIGNED_TO_YOU_SUCCESS:
    case actions.FETCH_YOUR_GROUP_TASKS_SUCCESS:
      return setData(state, action);

    case actions.FETCH_TASKS_ASSIGNED_TO_YOU_FAILURE:
    case actions.FETCH_YOUR_GROUP_TASKS_FAILURE:
      return state
        .set('isFetchingTasks', false);
    case actions.HANDLE_UNCLAIM: {
        const tasksLoaded = state.get('tasks');
        const {taskId} = action;
        const findIndex = tasksLoaded.findIndex(item => item.get('task').get('id') === taskId);
        return state.set('tasks', tasksLoaded.update(
            findIndex, item => item.setIn(['task', 'assignee'], null),
        ));
    }
    case actions.GROUP_YOUR_TASKS :
    case actions.GROUP_YOUR_TEAM_TASKS:
        return state.set('groupBy', action.groupBy);
      case actions.LOAD:
          return state.set('isFetchingTasks', true);
    case actions.LOAD_SUCCESS:
        return setData(state, action);
      case actions.LOAD_FAILURE:
          return state.set('isFetchingTasks', false);
    case actions.RESET_YOUR_TASKS:
      return initialState;
    default:
        return state;
    }
}

export default reducer;
