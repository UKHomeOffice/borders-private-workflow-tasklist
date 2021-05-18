import React from 'react';
import {createMemoryHistory} from "history";
import {Router} from "react-router";
import configureStore from "redux-mock-store";
import {Map} from "immutable";
import CaseAction from "./CaseAction";
import fixtures from "./fixtures";

describe('CaseAction', () => {
    let props;
    let store;
    beforeEach(() => {
        store = configureStore()({
            'case-action-page': new Map({}),
            'case-page': new Map({}),
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
                    line_manager_email: null,
                    delegate_email: null,
                    groups: ['/Group_One', '/Group_Two'],
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
            'case-page': new Map({}),
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
            'case-page': new Map({}),
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
            'case-page': new Map({}),
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
            'case-page': new Map({}),
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

    it('sets the latest form data path if there is a single form and a single process instance', async () => {
      const processInstances = [{
        formReferences: [{
          name: 'form1',
          dataPath: 'form1DataPath1'
        }]
      }];
      const wrapper = shallow(<CaseAction.WrappedComponent />);
      const path = wrapper.dive().instance().latestFormDataPath(processInstances, 'form1');
      expect(path).toEqual('form1DataPath1');
    });

    it('sets the latest form data path if there are multiple forms and multiple process instances', async () => {
      const processInstances = [{
        formReferences: [{
          name: 'form1',
          dataPath: 'form1DataPath1'
        }, {
          name: 'form2',
          dataPath: 'form2DataPath1'
        }]
      }, {
        formReferences: [{
          name: 'form1',
          dataPath: 'form1DataPath2'
        }, {
          name: 'form2',
          dataPath: 'form2DataPath2'
        }]
      }];
      const wrapper = shallow(<CaseAction.WrappedComponent />);
      const path = wrapper.dive().instance().latestFormDataPath(processInstances, 'form1');
      expect(path).toEqual('form1DataPath2');
    });
});
