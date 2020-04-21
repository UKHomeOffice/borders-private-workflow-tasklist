import { combineEpics } from 'redux-observable';
import { errorObservable } from '../../core/error/epicUtil';
import * as types from './actionTypes';
import * as actions from './actions';
import { retry } from '../../core/util/retry';

const fetchTasksAssignedYou = (action$, store, { client }) => action$.ofType(types.FETCH_TASKS_ASSIGNED_TO_YOU)
  .mergeMap(action => client({
    method: 'GET',
    path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/tasks?assignedToMeOnly=true&${action.sortValue
      ? action.sortValue : 'sort=due,desc'}${action.filterValue ? `&name=${action.filterValue}` : ''}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  }).retryWhen(retry).map(payload => actions.fetchTasksAssignedToYouSuccess(payload))
    .catch(error => errorObservable(actions.fetchTasksAssignedToYouFailure(), error)));


const fetchYourGroupTasks = (action$, store, { client }) => action$.ofType(types.FETCH_YOUR_GROUP_TASKS)
  .mergeMap(action => client({
    method: 'GET',
    path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/tasks?teamOnly=true&${action.sortValue
      ? action.sortValue : 'sort=due,desc'}${action.filterValue ? `&name=${action.filterValue}` : ''}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  }).retryWhen(retry).map(payload => actions.fetchYourGroupTasksSuccess(payload))
    .catch(error => errorObservable(actions.fetchYourGroupTasksFailure(), error)));

const load =  (action$, store, { client }) => action$.ofType(types.LOAD)
    .mergeMap(action => client({
        method: 'GET',
        path: `${action.url}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry).map(payload => actions.loadSuccess(payload))
        .catch(error => errorObservable(actions.loadFailure(), error)));

export default combineEpics(fetchTasksAssignedYou,
  fetchYourGroupTasks, load);
