import configureStore from "redux-mock-store";
import {Map} from "immutable";
import {createMemoryHistory} from "history";
import fixtures from "./fixtures";
import {Router} from "react-router";
import React from "react";
import CaseActions from "./CaseActions";
import {combineReducers, createStore} from 'redux';
import caseActions from "../index";
import {Provider} from "react-redux";

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

    it('renders action when selected', async () => {
        const history = createMemoryHistory('/case');

        const store = createStore(combineReducers({[caseActions.constants.NAME]: caseActions.reducer}),
            {});

        let wrapper = await mount(
            <Router history={history}>
                <Provider store={store}>
                    <CaseActions
                        {...props}
                    />
                </Provider>
            </Router>,
        );
        wrapper.find('a').at(0).prop('onClick')({
            preventDefault() {
            }
        });
        expect(wrapper.html()).toEqual('<div class="govuk-grid-row govuk-card" id="caseActions"><div class="govuk-grid-column-full"><h3 class="govuk-heading-m">Case actions</h3><div class="govuk-tabs" data-module="govuk-tabs"><ul class="govuk-tabs__list"><li class="govuk-tabs__list-item  govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#test"> test</a></li><li class="govuk-tabs__list-item "><a class="govuk-tabs__tab" href="#test2"> test2</a></li></ul><section class="govuk-tabs__panel" id="test"><div id="loadingActionForm">Loading</div></section></div></div></div>')
    })
});
