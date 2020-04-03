import configureStore from "redux-mock-store";
import {Map} from "immutable";
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import React from "react";
import {combineReducers, createStore} from 'redux';
import {Provider} from "react-redux";
import CaseActions from "./CaseActions";
import caseActions from "../index";
import fixtures from "./fixtures";

describe('CaseActions', () => {
    let props;
    beforeEach(() => {
        // Avoid `attachTo: document.body` Warning
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
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

    afterEach(() => {
        const div = document.getElementById('container');
        if (div) {
            document.body.removeChild(div);
        }
    })
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
          </Router>
        ,{ attachTo: document.getElementById('container') });
        const actions = wrapper.find('li');
        expect(actions.exists()).toEqual(true);
        expect(actions.length).toEqual(2)
    });

    it('renders action when selected', async () => {
        const history = createMemoryHistory('/case');

        const store = createStore(combineReducers({[caseActions.constants.NAME]: caseActions.reducer}),
            {});

        const wrapper = await mount(
          <Router history={history}>
            <Provider store={store}>
              <CaseActions
                {...props}
              />
            </Provider>
          </Router>,
            { attachTo: document.getElementById('container') });

        console.log(wrapper);
        wrapper.find('a').at(0).prop('onClick')({
            preventDefault() {
            }
        });
        expect(wrapper.html()).toEqual('<div class="govuk-grid-row govuk-card" id="caseActions"><div class="govuk-grid-column-full"><div id="caseDetails-businessKey-actions" class="govuk-accordion" data-module="govuk-accordion"><div class="govuk-accordion__controls"><button type="button" class="govuk-accordion__open-all" aria-expanded="false">Open all<span class="govuk-visually-hidden"> sections</span></button></div><div class="govuk-accordion__section"><div class="govuk-accordion__section-header"><h4 class="govuk-accordion__section-heading"><button type="button" id="heading-businessKey-actions" aria-controls="caseDetails-businessKey-actions-content-1" class="govuk-accordion__section-button" aria-expanded="false">Case actions</button><span class="govuk-accordion__icon" aria-hidden="true"></span></h4></div><div id="accordion-with-summary-sections-content-businessKey-actions" class="govuk-accordion__section-content" aria-labelledby="accordion-with-summary-sections-heading-businessKey-actions"><div class="govuk-tabs" data-module="govuk-tabs"><ul class="govuk-tabs__list"><li class="govuk-tabs__list-item  govuk-tabs__list-item--selected"><a class="govuk-tabs__tab" href="#test"> test</a></li><li class="govuk-tabs__list-item "><a class="govuk-tabs__tab" href="#test2"> test2</a></li></ul><section class="govuk-tabs__panel" id="test"><div id="loadingActionForm">Loading</div></section></div></div></div></div></div></div>')
    })
});
