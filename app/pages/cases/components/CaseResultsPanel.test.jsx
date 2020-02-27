import React from "react";
import CaseResultsPanel from "./CaseResultsPanel";
import {Router} from "react-router";
import {Provider} from "react-redux";
import {createMemoryHistory} from "history";
import configureStore from "redux-mock-store";
import {Map} from "immutable";

describe('CaseResultsPanel', () => {
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

        expect(wrapper.html()).toEqual('<div class="govuk-grid-row"><div class="govuk-grid-column-one-quarter"><h3 class="govuk-heading-m">Search results</h3><span class="govuk-caption-m">Number of cases found</span><h3 class="govuk-heading-m">2</h3><ul class="govuk-list"><li><a class="govuk-link" href="">businessKey1</a></li><li><a class="govuk-link" href="">businessKey2</a></li></ul></div><div class="govuk-grid-column-three-quarters"></div></div>')
    })
});
