import React from 'react';
import CaseAction from "./CaseAction";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import configureStore from "redux-mock-store";
import {Map} from "immutable";
import fixtures from "./fixtures";

describe('CaseAction', () => {
    let props;
    let store;
    beforeEach(() => {
        store = configureStore()({
            'case-action-page': new Map({}),
        });
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
                businessKey: 'businessKey'
            }
        };
    });
    it('can render an action', () => {
        const wrapper = shallow(<CaseAction {...props} />);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders empty div if selectedAction or caseDetails is null', async () => {
        const history = createMemoryHistory('/case');
        delete props.caseDetails;
        const wrapper = await mount(
            <Router history={history}>
                <CaseAction
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const emptyDiv = wrapper.find('#emptyAction').first();
        expect(emptyDiv.exists()).toEqual(true);
    });

    it('renders loading form text', async () => {
        const history = createMemoryHistory('/case');
        store = configureStore()({
            'case-action-page': new Map({
                loadingActionForm: true
            }),
        });
        props = {
            ...props,
            selectedAction: {
                process: {}
            }
        };
        const wrapper = await mount(
            <Router history={history}>
                <CaseAction
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const loadingFormDiv = wrapper.find('#loadingActionForm').first();
        expect(loadingFormDiv.exists()).toEqual(true);
    });
    it('renders empty div if form is null', async () => {
        const history = createMemoryHistory('/case');
        store = configureStore()({
            'case-action-page': new Map({
                loadingActionForm: false,
                actionForm: null
            }),
        });
        props = {
            ...props,
            selectedAction: {
                process: {}
            }
        };
        const wrapper = await mount(
            <Router history={history}>
                <CaseAction
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const emptyForm = wrapper.find('#emptyForm').first();
        expect(emptyForm.exists()).toEqual(true);
    });

    it('renders submitting action', async () => {
        const history = createMemoryHistory('/case');
        store = configureStore()({
            'case-action-page': new Map({
                loadingActionForm: false,
                actionForm: fixtures,
                executingAction: true
            }),
        });
        props = {
            ...props,
            selectedAction: {
                process: {}
            }
        };
        const wrapper = await mount(
            <Router history={history}>
                <CaseAction
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const submittingAction = wrapper.find('#submittingAction').first();
        expect(submittingAction.exists()).toEqual(true);
    });

    it('renders form for action', async () => {
        const history = createMemoryHistory('/case');
        store = configureStore()({
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
                <CaseAction
                    store={store}
                    {...props}
                />
            </Router>,
        );
        const formio = wrapper.find('Form');
        expect(formio.exists()).toEqual(true);
    });
});
