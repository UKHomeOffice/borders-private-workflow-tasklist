import * as types from './actionTypes';

const reset = () => ({
    type: types.RESET
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

const setSelectedVersionId = (versionId) => ({
    type: types.SET_SELECTED_VERSION_ID,
    versionId
});

export {
    findCasesByKey,
    findCasesByKeySuccess,
    findCasesByKeyFailure,
    reset,
    getCaseByKey,
    getCaseByKeySuccess,
    getCaseByKeyFailure,
    getFormVersion,
    getFormVersionSuccess,
    getFormVersionFailure,
    setSelectedVersionId
}
