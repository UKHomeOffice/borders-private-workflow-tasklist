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

describe('Cases epic', () => {
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
    it('can find cases by key', done => {
        const action$ = ActionsObservable.of(
            { type: 'FIND_CASES_BY_KEY', key: 'BF-23' },
        );

        const payload = {
            'entity' : {
                '_embedded' : {
                    cases: [{
                        businessKey: 'testA'
                    }]
                },
                '_links' : {
                    'self' : {
                        href: 'test'
                    },
                    'next': {
                        href: 'nextA'
                    }
                },
                'page' : {
                    'totalElements': 10
                }
            }

        };
        const client = () => Observable.of(payload);
        const expectedOutput = {
            type: types.FIND_CASES_BY_KEY_SUCCESS, payload,
        };
        epic(action$, store, { client })
            .subscribe(actualOutput => {
                expect(actualOutput).toEqual(expectedOutput);
                done();
            });
    });
});
