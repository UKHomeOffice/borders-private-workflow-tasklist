import { combineEpics } from 'redux-observable';
import PubSub from 'pubsub-js';
import * as types from './actionTypes';
import * as actions from './actions';
import { errorObservable } from '../../../core/error/epicUtil';
import { retry } from '../../../core/util/retry';


const fetchProcessDefinition = (action$, store, { client }) => action$.ofType(types.FETCH_PROCESS_DEFINITION)
  .mergeMap(action => client({
    method: 'GET',
    path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/process-definitions/${action.processKey}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  }).retryWhen(retry).map(payload => actions.fetchProcessDefinitionSuccess(payload))
    .catch(error => errorObservable(actions.fetchProcessDefinitionFailure(), error)));

const fetchForm = (action$, store, { client }) => action$.ofType(types.FETCH_FORM)
  .mergeMap(action => client({
    method: 'GET',
    path: `${store.getState().appConfig.formUrl}/form/name/${action.formName}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  })
    .retryWhen(retry)
    .map(payload => actions.fetchFormSuccess(payload))
    .catch(error => errorObservable(actions.fetchFormFailure(), error)));

const fetchFormWithContext = (action$, store, { client }) => action$.ofType(types.FETCH_FORM_WITH_CONTEXT)
  .mergeMap(action => client({
    method: 'POST',
    path: `${store.getState().appConfig.formUrl}/form`,
    entity: {
      formName: action.formName,
      dataContext: action.dataContext,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  })
    .retryWhen(retry)
    .map(payload => actions.fetchFormSuccess(payload))
    .catch(error => errorObservable(actions.fetchFormFailure(), error)));

const createVariable = (submissionData, variableName, email) => {
  const variables = {};
  variables[variableName] = {
    value: JSON.stringify(submissionData),
    type: 'json',
  };
  variables.initiatedBy = {
    value: email,
    type: 'String',
  };

  variables.type = {
    value: 'non-notifications',
    type: 'String',
  };
  return {
    variables,
  };
};


const submit = (action$, store, { client }) => action$.ofType(types.SUBMIT)
  .mergeMap(action => {
    const {
      submissionData, nonShiftApiCall, variableName, processKey
    } = action;
    return client({
      method: 'POST',
      path: nonShiftApiCall ? `${store.getState().appConfig.workflowServiceUrl}/rest/camunda/process-definition/key/${action.processKey}/start`
        : `${store.getState().appConfig.workflowServiceUrl}/api/workflow/process-instances`,
      entity: nonShiftApiCall ? createVariable(submissionData, variableName, store.getState().keycloak.tokenParsed.email)
        : {
          data: submissionData,
          processKey: processKey,
          variableName: variableName,
          businessKey: submissionData.businessKey,
        },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
        'Content-Type': 'application/json',
      },
    }).retryWhen(retry)
      .map(payload => {
        return actions.submitToWorkflowSuccess(payload);
      })
      .catch(error => errorObservable(actions.submitToWorkflowFailure(), error));
  });

export default combineEpics(fetchProcessDefinition, fetchForm, fetchFormWithContext, submit);
