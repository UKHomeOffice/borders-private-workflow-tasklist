import 'rxjs/add/observable/of';
import 'rxjs/add/operator/merge';
import {combineEpics} from 'redux-observable';

import * as types from './actionTypes';
import * as actions from './actions';
import {errorObservable} from '../../core/error/epicUtil';
import {retry} from '../../core/util/retry';

const findCasesByKey = (action$, store, {client}) => action$.ofType(types.FIND_CASES_BY_KEY)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/cases?query=${encodeURIComponent(`${action.key}`)}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.findCasesByKeySuccess(payload))
        .catch(error => errorObservable(actions.findCasesByKeyFailure(), error)));


const getCaseByKey = (action$, store, {client}) => action$.ofType(types.GET_CASE_BY_KEY)
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


const getFormVersion = (action$, store, {client}) => action$.ofType(types.GET_FORM_VERSION)
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

const getFormSubmissionData = (action$, store, {client}) => action$.ofType(types.GET_FORM_SUBMISSION_DATA)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/cases/${action.businessKey}/submission?key=${action.submissionDataKey}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.getFormSubmissionDataSuccess(payload))
        .catch(error => errorObservable(actions.getFormSubmissionDataFailure(), error)));

const getCaseAttachments = (action$, store, {client}) => action$.ofType(types.GET_CASE_ATTACHMENTS)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.attachmentServiceUrl}/files/${action.businessKey}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.getCaseAttachmentsSuccess(payload))
        .catch(error => errorObservable(actions.getCaseAttachmentsFailure(), error)));

const loadNextSearchResults = (action$, store, {client}) => action$.ofType(types.LOAD_NEXT_SEARCH_RESULTS)
    .mergeMap(action => client({
        method: 'GET',
        path: `${action.url}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.loadNextSearchResultsSuccess(payload))
        .catch(error => errorObservable(actions.loadNextSearchResultsFailure(), error)));

export default combineEpics(findCasesByKey, getCaseByKey, getFormVersion, getFormSubmissionData,
    loadNextSearchResults, getCaseAttachments);
