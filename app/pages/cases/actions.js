import * as types from './actionTypes';

const resetCase = () => ({
    type: types.RESET_CASE
})

const findCasesByKey = key => ({
    type: types.FIND_CASES_BY_KEY,
    key
});

const findCasesByKeySuccess = payload => ({
    type: types.FIND_CASES_BY_KEY_SUCCESS,
    payload
});

const findCasesByKeyFailure = () => ({
    type: types.FIND_CASES_BY_KEY_FAILURE,
});

const getCaseByKey = key => ({
    type: types.GET_CASE_BY_KEY,
    key
});

const getCaseByKeySuccess = payload => ({
    type: types.GET_CASE_BY_KEY_SUCCESS,
    payload
});

const getCaseByKeyFailure = () => ({
    type: types.GET_CASE_BY_KEY_FAILURE
});

const getFormVersion = (versionId) => ({
    type: types.GET_FORM_VERSION,
    versionId
});

const getFormVersionSuccess = (payload) => ({
    type: types.GET_FORM_VERSION_SUCCESS,
    payload
});

const getFormVersionFailure = () => ({
    type: types.GET_FORM_VERSION_FAILURE
});

const setSelectedFormReference = (formReference) => ({
    type: types.SET_SELECTED_FORM_REFERENCE,
    formReference
});

const getFormSubmissionData = (businessKey, submissionDataKey) => ({
    type: types.GET_FORM_SUBMISSION_DATA,
    businessKey,
    submissionDataKey
});


const getFormSubmissionDataSuccess = (payload) => ({
    type: types.GET_FORM_SUBMISSION_DATA_SUCCESS,
    payload
});

const getFormSubmissionDataFailure = () => ({
    type: types.GET_FORM_SUBMISSION_DATA_FAILURE,
});

const resetForm = () => ({
    type: types.RESET_FORM
});

const loadNextSearchResults = (url) => ({
    type: types.LOAD_NEXT_SEARCH_RESULTS,
    url
});

const loadNextSearchResultsSuccess = (payload) => ({
    type: types.LOAD_NEXT_SEARCH_RESULTS_SUCCESS,
    payload
});

const loadNextSearchResultsFailure = () => ({
    type: types.LOAD_NEXT_SEARCH_RESULTS_FAILURE
})

export {
    findCasesByKey,
    findCasesByKeySuccess,
    findCasesByKeyFailure,
    resetCase,
    getCaseByKey,
    getCaseByKeySuccess,
    getCaseByKeyFailure,
    getFormVersion,
    getFormVersionSuccess,
    getFormVersionFailure,
    setSelectedFormReference,
    getFormSubmissionData,
    getFormSubmissionDataSuccess,
    getFormSubmissionDataFailure,
    resetForm,
    loadNextSearchResults,
    loadNextSearchResultsFailure,
    loadNextSearchResultsSuccess
}
