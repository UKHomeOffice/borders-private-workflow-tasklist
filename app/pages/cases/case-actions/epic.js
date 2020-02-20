import * as types from "./actionTypes";
import {retry} from "../../../core/util/retry";
import * as actions from "./actions";
import {errorObservable} from "../../../core/error/epicUtil";
import {combineEpics} from "redux-observable";

const getActionForm = (action$, store, {client}) => action$.ofType(types.GET_ACTION_FORM)
    .mergeMap(action => client({
        method: 'GET',
        path: `${store.getState().appConfig.formUrl}/form/name/${action.formKey}`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${store.getState().keycloak.token}`,
        },
    }).retryWhen(retry)
        .map(payload => actions.fetchActionFormSuccess(payload))
        .catch(error => errorObservable(actions.fetchActionFormFailure(), error)));


const executeAction = (action$, store, { client }) => action$.ofType(types.EXECUTE_ACTION)
    .mergeMap(action => {
        const {
         submissionData,
         selectedAction,
         caseDetails
        } = action;
        return client({
            method: 'POST',
            path: `${store.getState().appConfig.workflowServiceUrl}/api/workflow/process-instances`,
            entity:  {
                    data: submissionData,
                    processKey: selectedAction.process['process-definition'].key,
                    variableName: selectedAction.process.formKey,
                    businessKey: caseDetails.businessKey,
                },
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.getState().keycloak.token}`,
                'Content-Type': 'application/json',
            },
        }).retryWhen(retry)
            .map(payload => {
                return actions.executeActionSuccess(payload);
            })
            .catch(error => errorObservable(actions.executeActionFailure(), error));
    });

export default combineEpics(getActionForm, executeAction);
