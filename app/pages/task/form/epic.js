import { combineEpics } from 'redux-observable';
import PubSub from 'pubsub-js';
import * as types from './actionTypes';
import * as actions from './actions';
import { errorObservable } from '../../../core/error/epicUtil';
import { retry } from '../../../core/util/retry';


const createProcessVariables = (action, userEmail) => {
  const processVariables = {};
  processVariables[action.variableName] = {
    value: JSON.stringify(action.event.data),
    type: 'json',
  };
  processVariables.customEventUserId = {
    value: userEmail,
    type: 'string',
  };
  return processVariables;
};

const customEvent = (action$, store, { client }) => action$.ofType(types.TASK_CUSTOM_EVENT)
  .mergeMap(action => client({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
    path: `${store.getState().appConfig.workflowServiceUrl}/rest/camunda/message`,
    entity: {
      messageName: action.event.type,
      processInstanceId: action.task.get('processInstanceId'),
      processVariables: createProcessVariables(
        action, store.getState().keycloak.tokenParsed.email,
      ),
    },
  }).retryWhen(retry)
    .map(payload => {
      const { properties } = action.event.component;
      const message = properties && properties['success-message']
        ? properties['success-message'] : `${action.event.component.label} successfully actioned`;
      PubSub.publish('submission', {
        submission: true,
        autoDismiss: true,
        message,
      });
      return actions.customEventSuccess(payload);
    })
    .catch(error => errorObservable(actions.customEventFailure(error, action.event), error)));

const fetchTaskForm = (action$, store, { client }) => action$.ofType(types.FETCH_TASK_FORM)
  .mergeMap(action => client({
    method: 'GET',
    path: `${store.getState().appConfig.formUrl}/form/name/${action.task.get('formKey')}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  })
    .retryWhen(retry)
    .map(payload => actions.fetchTaskFormSuccess(payload))
    .catch(error => errorObservable(actions.fetchTaskFormFailure(), error)));


const submitTaskForm = (action$, store, { client }) => action$.ofType(types.SUBMIT_TASK_FORM)
  .mergeMap(action => {
    const data = {
      variables: {},
    };
    data.variables[action.variableName] = {
      value: JSON.stringify(action.submission),
      type: 'Json',
      valueInfo: {},
    };
    return client({
      method: 'POST',
      path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/tasks/${action.taskId}/form/_complete`,
      entity: data,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
        'Content-Type': 'application/json',
      },
    }).map(payload => {
      return actions.completeTaskSuccess(payload);
    }).catch(error => errorObservable(actions.completeTaskFailure(), error))
  });




export default combineEpics(fetchTaskForm, submitTaskForm, customEvent);
