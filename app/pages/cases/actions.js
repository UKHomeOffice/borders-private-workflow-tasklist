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

export {
    findCasesByKey,
    findCasesByKeySuccess,
    findCasesByKeyFailure,
    reset
}
