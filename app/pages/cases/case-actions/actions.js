import * as types from './actionTypes';

const fetchActionForm = formKey => ({
    type: types.GET_ACTION_FORM,
    formKey
});

const fetchActionFormSuccess = payload => ({
    type: types.GET_ACTION_FORM_SUCCESS,
    payload
});

const fetchActionFormFailure = () => ({
    type: types.GET_ACTION_FORM_FAILURE
});

const setSelectedAction = action => ({
    type: types.SELECT_ACTION,
    action
});
const resetSelectedAction = () => ({
    type: types.RESET_SELECTED_ACTION
});


const executeAction = (selectedAction, submissionData, caseDetails) => ({
    type: types.EXECUTE_ACTION,
    selectedAction,
    submissionData,
    caseDetails
});

const executeActionSuccess = payload => ({
   type: types.EXECUTE_ACTION_SUCCESS,
   payload
});

const executeActionFailure = () => ({
    type: types.EXECUTE_ACTION_FAILURE
});

const clearActionResponse = () => ({
    type: types.CLEAR_ACTION_RESPONSE
});

export {
    fetchActionForm,
    fetchActionFormSuccess,
    fetchActionFormFailure,
    setSelectedAction,
    resetSelectedAction,
    executeAction,
    executeActionSuccess,
    executeActionFailure,
    clearActionResponse
}
