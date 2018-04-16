import * as types from './actionTypes';

const fetchForm = (formName) => ({
   type : types.FETCH_FORM,
   formName
});

const fetchFormWithContext = (formName, dataContext) => ({
    type : types.FETCH_FORM_WITH_CONTEXT,
    formName,
    dataContext
});





const fetchFormSuccess = payload => ({
   type: types.FETCH_FORM_SUCCESS,
   payload
});

const fetchFormFailure = error => ({
    error: true,
    payload: error.raw.message,
    type: types.FETCH_FORM_FAILURE
});


const submit = (formId,  processKey, variableName, submissionData)=> ({
    type: types.SUBMIT,
    formId,
    processKey,
    variableName,
    submissionData
});

const submitSuccess = (payload) => ({
    type: types.SUBMIT_SUCCESS,
    payload
});

const submitFailure = (error) => ({
    type: types.SUBMIT_FAILURE,
    error
});

const submitToWork = (processKey, variableName, data) => ({
    type: types.SUBMIT_TO_WORKFKOW,
    processKey,
    variableName,
    data
});

const submitToWorkflowSuccess = (payload) => ({
    type: types.SUBMIT_TO_WORKFKOW_SUCCESS,
    payload
});

const submitToWorkflowFailure = (error) => ({
    type: types.SUBMIT_TO_WORKFKOW_FAILURE,
    error:true,
    payload: error
});


export {
    fetchForm,
    fetchFormWithContext,
    fetchFormSuccess,
    fetchFormFailure,
    submit,
    submitSuccess,
    submitFailure,
    submitToWork,
    submitToWorkflowSuccess,
    submitToWorkflowFailure
}