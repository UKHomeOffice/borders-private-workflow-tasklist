import configureMockStore from 'redux-mock-store';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import reducer from './reducer';
import * as types from './actionTypes';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import epic from './epic';
import 'rxjs';
import PubSub from 'pubsub-js';

jest.setTimeout(50000);

jest.mock('pubsub-js', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  publish: jest.fn(),
}));


describe('shift epic', () => {
  const store = configureMockStore()({
    keycloak: {
      token: 'test',
      tokenParsed: {
        email: 'testEmail@email.com',
      },
    },
    appConfig: {
      workflowServiceUrl: 'http://localhost:9000',
    },
  });
  store.replaceReducer(reducer);
  it('can perform endShift', done => {
    const action$ = ActionsObservable.of(
      { type: 'END_SHIFT', payload: {} },
    );

    const client = () => Observable.of({});
    const expectedOutput = {
      type: types.END_SHIFT_SUCCESS, payload: {},
    };

    epic(action$, store, { client })
      .subscribe(actualOutput => {
        expect(actualOutput)
          .toEqual(expectedOutput);
        done();
      });
  });
  it('can hand endShift failure', done => {
    const action$ = ActionsObservable.of(
      { type: 'END_SHIFT', payload: {} },
    );

    const client = () => Observable.throw({
      status: {
        code: 400,
      },
    });

    Observable.concat(epic(action$, store, { client }))
      .toArray()
      .subscribe(data => {
        const submitFailure = data[0];
        const error = data[1];
        expect(submitFailure)
          .toEqual({
            type: types.END_SHIFT_FAILURE,
          });
        expect(error)
          .toEqual({
            type: 'HANDLE_ERROR',
            payload: {
              status: {
                code: 400,
              },
            },
          });
        done();
      });
  });
  it('can fetchStaffDetails', done => {
    const action$ = ActionsObservable.of(
      { type: types.FETCH_STAFF_DETAILS, payload: {} },
    );
    const payload = {
      staffid: 'staffid',
    };
    const client = () => Observable.of(payload);
    const expectedOutput = {
      type: types.FETCH_STAFF_DETAILS_SUCCESS, payload,
    };

    epic(action$, store, { client })
      .subscribe(actualOutput => {
        expect(actualOutput)
          .toEqual(expectedOutput);
        done();
      });
  });
  it('can fetchShiftForm', done => {
    const action$ = ActionsObservable.of(
      { type: types.FETCH_SHIFT_FORM, payload: {} },
    );
    const payload = {
      name: 'startShift',
    };
    const client = () => Observable.of(payload);
    const expectedOutput = {
      type: types.FETCH_SHIFT_FORM_SUCCESS, payload,
    };

    epic(action$, store, { client })
      .subscribe(actualOutput => {
        expect(actualOutput)
          .toEqual(expectedOutput);
        done();
      });
  });
  it('can fetchActiveShift', done => {
    const action$ = ActionsObservable.of(
      { type: types.FETCH_ACTIVE_SHIFT, payload: {} },
    );
    const payload = {
      status: {
        code: 200,
      },
      entity: {
        shiftid: 'shiftid',
      },

    };
    const client = () => Observable.of(payload);
    const expectedOutput = {
      type: types.FETCH_ACTIVE_SHIFT_SUCCESS, payload,
    };

    epic(action$, store, { client })
      .subscribe(actualOutput => {
        expect(actualOutput)
          .toEqual(expectedOutput);
        done();
      });
  });
  it('can fetchActiveShift retry if 503', done => {
    const action$ = ActionsObservable.of(
      { type: types.FETCH_ACTIVE_SHIFT, payload: {} },
    );
    const payload = {
      status: {
        code: 503,
      },
    };
    const client = () => Observable.from(Promise.reject(payload));

    Observable.concat(epic(action$, store, { client }))
      .toArray()
      .subscribe(data => {
        const fetchFailure = data[0];
        const error = data[1];
        expect(fetchFailure.type)
          .toEqual('FETCH_ACTIVE_SHIFT_FAILURE');
        expect(error.type)
          .toEqual('HANDLE_ERROR');
        done();
      });
  });
  it('can submit shift', done => {
    const action$ = ActionsObservable.of(
      { type: types.SUBMIT_VALIDATION, payload: {} },
    );
    const payload = {
      status: {
        code: 200,
      },
      entity: [{
        staffid: 'staffid',
      }],
    };
    const client = () => Observable.of(payload);

    Observable.concat(epic(action$, store, { client }))
      .toArray()
      .subscribe(actualOutput => {
        const createActiveShift = actualOutput[0];
        expect(createActiveShift.type).toEqual('CREATE_ACTIVE_SHIFT_SUCCESS');
        done();
      });
  });

});
