import configureStore from "redux-mock-store";
import {Map} from "immutable";
import {createMemoryHistory} from "history";
import fixtures from "./fixtures";
import {Router} from "react-router";
import React from "react";
import CaseActions from "./CaseActions";

describe('CaseActions', () => {
    let props;
    beforeEach(() => {
        props = {
            appConfig: {
                referenceDataUrl: 'test',
                workflowUrl: 'test',
                operationalDataUrl: 'test',
            },
            kc: {
                token: 'token',
                tokenParsed: {
                    email: 'yesy',
                    family_name: 'test',
                    given_name: 'name',
                    session_state: 'state',
                },
            },
            caseDetails: {
                businessKey: 'businessKey',
                actions: [{
                    process: {
                        "process-definition": {
                            "key": "test",
                            "name": "test"
                        }
                    }
                },
                    {
                        process: {
                            "process-definition": {
                                "key": "test2",
                                "name": "test2"
                            }
                        }
                    }]
            }
        };
    });
    it('renders collection of actions as nav links', async () => {
        const history = createMemoryHistory('/case');
        const store = configureStore()({
            'case-action-page': Map({
                loadingActionForm: false,
                actionForm: fixtures,
                executingAction: false,
            }),
            keycloak: props.kc,
            appConfig: props.appConfig
        });
        props = {
            ...props,
            selectedAction: {
                process: {}
            }
        };
        const wrapper = await mount(
            <Router history={history}>
                <CaseActions
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const actions = wrapper.find('li');
        expect(actions.exists()).toEqual(true);
        expect(actions.length).toEqual(2)
    });
});
