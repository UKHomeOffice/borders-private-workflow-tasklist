import Immutable from 'immutable';
import { combineEpics } from 'redux-observable';
import PubSub from 'pubsub-js';
import * as types from './actionTypes';
import * as actions from './actions';
import errorObservable from '../error/epicUtil';
import retry from '../util/retry';

const shift = (email, token, workflowUrl, client) => {
  return client({
    method: 'GET',
    path: `${workflowUrl}/api/workflow/shift/${email}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const endShift = (action$, store, { client }) =>
  action$.ofType(types.END_SHIFT).mergeMap(() =>
    client({
      method: 'DELETE',
      path: `${
        store.getState().appConfig.workflowServiceUrl
      }/api/workflow/shift/${
        store.getState().keycloak.tokenParsed.email
      }?deletedReason=finished`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
      },
    })
      .retryWhen(retry)
      .map(payload => actions.endShiftSuccess(payload))
      .catch(error => errorObservable(actions.endShiftFailure(), error)),
  );

const fetchStaffDetails = (action$, store, { client }) =>
  action$.ofType(types.FETCH_STAFF_DETAILS).mergeMap(() =>
    client({
      method: 'GET',
      path: `${
        store.getState().appConfig.apiRefUrl
      }/v2/entities/team?filter=id=eq.${
        store.getState().keycloak.tokenParsed.team_id
      }`,
      entity: {
        argstaffemail: `${store.getState().keycloak.tokenParsed.email}`,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
      },
    })
    .retryWhen(retry)
    .map(payload => {
      let staffDetails;
      const { entity: staffResponse } = payload;
      if (staffResponse && staffResponse.data.length) {
        staffDetails = {
          adelphi: store.getState().keycloak.tokenParsed.adelphi_number,
          dateofleaving: store.getState().keycloak.tokenParsed
          .dateofleaving,
          defaultlocationid: store.getState().keycloak.tokenParsed
          .location_id,
          defaultteam: staffResponse.data[0],
          defaultteamid: staffResponse.data[0].id,
          email: store.getState().keycloak.tokenParsed.email,
          gradeid: store.getState().keycloak.tokenParsed.grade_id,
          locationid: store.getState().keycloak.tokenParsed.location_id,
          phone: store.getState().keycloak.tokenParsed.phone,
          teamid: store.getState().keycloak.tokenParsed.team_id,
        };
      } else {
        staffDetails = null;
      }
      return actions.fetchStaffDetailsSuccess(staffDetails);
    })
    .catch(error =>
      errorObservable(actions.fetchStaffDetailsFailure(), error),
    ),
);
const fetchStaffId = (action$, store, { client }) =>
action$.ofType(types.FETCH_STAFF_ID).mergeMap(() =>
  client({
    method: 'GET',
    path: `${
      store.getState().appConfig.operationalDataUrl
    }/v2/staff?filter=email=eq.${store.getState().keycloak.tokenParsed.email}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().keycloak.token}`,
    },
  })
    .retryWhen(retry)
    .map(payload => {
      const { entity } = payload;
      console.log('Shift epic fetched staff id:', entity[0].staffid);
      return actions.fetchStaffIdSuccess(entity[0].staffid);
    })
    .catch(error =>
      errorObservable(actions.fetchStaffIdFailure(), error),
    ),
);
const fetchShiftForm = (action$, store, { client }) =>
  action$.ofType(types.FETCH_SHIFT_FORM).mergeMap(() =>
    client({
      method: 'GET',
      path: `${
        store.getState().appConfig.formUrl
      }/form/name/startShift?disableDataContext=false`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
      },
    })
      .retryWhen(retry)
      .map(payload => actions.fetchShiftFormSuccess(payload))
      .catch(error => errorObservable(actions.fetchShiftFormFailure(), error)),
  );

const fetchActiveShift = (action$, store, { client }) =>
  action$.ofType(types.FETCH_ACTIVE_SHIFT).mergeMap(() =>
    shift(
      store.getState().keycloak.tokenParsed.email,
      store.getState().keycloak.token,
      store.getState().appConfig.workflowServiceUrl,
      client,
    )
      .map(payload => {
        return actions.fetchActiveShiftSuccess(payload);
      })
      .retryWhen(retry)
      .catch(error =>
        errorObservable(actions.fetchActiveShiftFailure(), error),
      ),
  );

const submit = (action$, store, { client }) =>
  action$.ofType(types.SUBMIT_VALIDATION).mergeMap(action => {
    const shiftData = action.submissionData;
    return client({
      method: 'POST',
      path: `${
        store.getState().appConfig.workflowServiceUrl
      }/api/workflow/shift`,
      entity: shiftData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${store.getState().keycloak.token}`,
        'Content-Type': 'application/json',
      },
    })
      .map(payload => {
        PubSub.publish('submission', {
          submission: true,
          autoDismiss: true,
          message: 'Shift successfully started',
        });
        return actions.createActiveShiftSuccess(payload);
      })
      .retryWhen(retry)
      .catch(error => errorObservable(actions.submitFailure(), error));
  });

export default combineEpics(
  fetchActiveShift,
  submit,
  fetchShiftForm,
  fetchStaffDetails,
  fetchStaffId,
  endShift,
);
