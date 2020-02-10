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

export default combineEpics(findCasesByKey);
