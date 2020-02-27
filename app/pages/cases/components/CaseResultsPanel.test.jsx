import React from "react";
import CaseResultsPanel from "./CaseResultsPanel";
import {Router} from "react-router";
import {Provider} from "react-redux";
import {createMemoryHistory} from "history";
import configureStore from "redux-mock-store";
import {Map} from "immutable";

describe('CaseResultsPanel', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<CaseResultsPanel/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders searching text', async () => {
        const history = createMemoryHistory('/case');
        const props = {
            searching: true,
            businessKeyQuery: 'BF-'
        };
        const store = configureStore()({
            'case-page': Map({
            }),
            keycloak: props.kc,
            appConfig: props.appConfig
        });

        const wrapper = mount(<Router history={history}>
            <Provider store={store}>
                <CaseResultsPanel {...store} {...props}/>
            </Provider></Router>);

        expect(wrapper.find('h4').exists()).toEqual(true);
        expect(wrapper.find('h4').text()).toEqual('Searching cases with reference BF-...')
    });

    it('returns empty div if no results', async() => {
        const history = createMemoryHistory('/case');
        const props = {
            searching: false,
            businessKeyQuery: 'BF-',
            caseSearchResults: null
        };
        const store = configureStore()({
            'case-page': Map({
            }),
            keycloak: props.kc,
            appConfig: props.appConfig
        });

        const wrapper = mount(<Router history={history}>
            <Provider store={store}>
                <CaseResultsPanel {...store} {...props}/>
            </Provider></Router>);

        expect(wrapper.find('div').exists()).toEqual(true);
        expect(wrapper.find('div').children().length).toEqual(0)
    });
    it('renders search result keys', async() => {
        const history = createMemoryHistory('/case');
        const props = {
            searching: false,
            businessKeyQuery: 'BF-',
            caseSearchResults: {
                page: {
                    totalElements: 2
                },
                '_embedded' : {
                    cases: [{
                        businessKey: 'businessKey1'
                    },{
                        businessKey: 'businessKey2'
                    }]
                }
            }
        };
        const store = configureStore()({
            'case-page': Map({
            }),
            keycloak: props.kc,
            appConfig: props.appConfig
        });

        const wrapper = mount(<Router history={history}>
            <Provider store={store}>
                <CaseResultsPanel {...store} {...props}/>
            </Provider></Router>);

        expect(wrapper).toMatchSnapshot();
    })
});
