import Immutable from 'immutable';
import * as actions from './actionTypes';
import _ from 'lodash';
const {Map} = Immutable;

export const initialState = new Map({
    searching: false,
    businessKeyQuery: null,
    caseSearchResults: null,
    loadingCaseDetails: false,
    caseDetails: null,
    businessKey: null,
    loadingFormVersion: false,
    formVersionDetails: null,
    selectedFormReference: null,
    loadingFormSubmissionData: false,
    formSubmissionData: null,
    loadingNextSearchResults: false,
    processStartSort: 'acs'
});

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.FIND_CASES_BY_KEY:
            return state.set('businessKeyQuery', action.key)
                .set('searching', true)
                .set('caseDetails', null)
                .set('businessKey', null);
        case actions.FIND_CASES_BY_KEY_SUCCESS:
            return state.set('searching', false)
                .set('caseSearchResults', action.payload.entity);
        case actions.FIND_CASES_BY_KEY_FAILURE:
            return state.set('searching', false);
        case actions.GET_CASE_BY_KEY:
            return state.set('businessKey', action.key)
                .set('loadingCaseDetails', true);
        case actions.GET_CASE_BY_KEY_SUCCESS:
            const caseLoaded = action.payload.entity;
            caseLoaded.processInstances =  _.orderBy(caseLoaded.processInstances, (instance) => {
                return new Date(instance.startDate);
            }, [state.get('processStartSort')]);
            return state.set('caseDetails', caseLoaded)
                .set('loadingCaseDetails', false);
        case actions.GET_CASE_BY_KEY_FAILURE:
            return state.set('loadingCaseDetails', false);
        case actions.GET_FORM_VERSION:
            return state.set('loadingFormVersion', true);
        case actions.GET_FORM_VERSION_SUCCESS:
            return state.set('loadingFormVersion', false)
                .set('formVersionDetails', action.payload.entity);
        case actions.GET_FORM_VERSION_FAILURE:
            return state.set('loadingFormVersion', false);
        case actions.SET_SELECTED_FORM_REFERENCE:
            return state.set('selectedFormReference', action.formReference);
        case actions.GET_FORM_SUBMISSION_DATA:
            return state.set('loadingFormSubmissionData', true);
        case actions.GET_FORM_SUBMISSION_DATA_SUCCESS:
            return state.set('loadingFormSubmissionData', false)
                .set('formSubmissionData', action.payload.entity);
        case actions.GET_FORM_SUBMISSION_DATA_FAILURE:
            return state.set('loadingFormSubmissionData', false);

        case actions.LOAD_NEXT_SEARCH_RESULTS:
            return state.set('loadingNextSearchResults', true);

        case actions.LOAD_NEXT_SEARCH_RESULTS_SUCCESS:
            const results = action.payload.entity._embedded? action.payload.entity._embedded.cases: [];
            const caseSearchResults = state.get('caseSearchResults');

            const cases = caseSearchResults._embedded.cases;
            const updatedResults = _.unionBy(cases, results, 'businessKey');

            caseSearchResults._embedded.cases = updatedResults;
            caseSearchResults._links = action.payload.entity._links;
            return state.set('loadingNextSearchResults', false)
                .set('caseSearchResults', caseSearchResults);
        case actions.LOAD_NEXT_SEARCH_RESULTS_FAILURE:
            return state.set('loadingNextSearchResults', false);
        case actions.RESET_FORM:
            return state.set('formSubmissionData', null)
                .set('formVersionDetails', null);

        case actions.SET_PROCESS_START_DATE_SORT:
            const processStartSort = action.sort;
            const caseDetails = state.get('caseDetails');

            caseDetails.processInstances =  _.orderBy(caseDetails.processInstances, (instance) => {
                return new Date(instance.startDate);
            }, [processStartSort]);
            return state.set('caseDetails', caseDetails).set('processStartSort', processStartSort);
        case actions.RESET_CASE:
            return initialState;
        default:
            return state;
    }
}


export default reducer;
