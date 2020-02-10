import 'rxjs/add/observable/of';
import 'rxjs/add/operator/merge';
import { combineEpics } from 'redux-observable';

import * as types from './actionTypes';
import * as actions from './actions';
import { errorObservable } from '../../core/error/epicUtil';
import { retry } from '../../core/util/retry';

const findCasesByKey = (action$, store, { client }) => action$.ofType(types.FIND_CASES_BY_KEY)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/cases?businessKeyQuery=${action.key}%`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.findCasesByKeySuccess(payload))
        .catch(error => errorObservable(actions.findCasesByKeyFailure(), error)));


const getCaseByKey = (action$, store, { client }) => action$.ofType(types.GET_CASE_BY_KEY)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/cases/${action.key}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.getCaseByKeySuccess(payload))
        .catch(error => errorObservable(actions.getCaseByKeyFailure(), error)));


const getFormVersion = (action$, store, { client }) => action$.ofType(types.GET_FORM_VERSION)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.formUrl}/form/version/${action.versionId}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.getFormVersionSuccess(payload))
        .catch(error => errorObservable(actions.getFormVersionFailure(), error)));

export default combineEpics(findCasesByKey, getCaseByKey, getFormVersion);
