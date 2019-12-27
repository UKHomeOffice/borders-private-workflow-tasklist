import * as types from './actionTypes';

const fetchExtendedStaffDetails = staffId => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS,
  staffId,
});

const fetchExtendedStaffDetailsSuccess = payload => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS_SUCCESS,
  payload,
});

const fetchExtendedStaffDetailsFailure = () => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS_FAILURE,
});

const fetchProcessDefinition = processKey => ({
  type: types.FETCH_PROCESS_DEFINITION,
  processKey,
});

const fetchProcessDefinitionSuccess = payload => ({
  type: types.FETCH_PROCESS_DEFINITION_SUCCESS,
  payload,
});

const fetchProcessDefinitionFailure = () => ({
  type: types.FETCH_PROCESS_DEFINITION_FAILURE,
});

const clearProcessDefinition = () => ({
  type: types.RESET_PROCEDURE,
});

const fetchForm = formName => ({
  type: types.FETCH_FORM,
  formName,
});

const fetchFormWithContext = (formName, dataContext) => ({
  type: types.FETCH_FORM_WITH_CONTEXT,
  formName,
  dataContext,
});

const fetchFormSuccess = payload => ({
  type: types.FETCH_FORM_SUCCESS,
  payload,
});

const fetchFormFailure = () => ({
  type: types.FETCH_FORM_FAILURE,
});

const submit = (
  formId,
  processKey,
  variableName,
  submissionData,
  processName,
  nonShiftApiCall,
) => ({
  type: types.SUBMIT,
  formId,
  processKey,
  variableName,
  submissionData,
  processName,
  nonShiftApiCall,
});

const submitSuccess = payload => ({
  type: types.SUBMIT_SUCCESS,
  payload,
});

const submitFailure = () => ({
  type: types.SUBMIT_FAILURE,
});

const submitToWorkflow = (
  processKey,
  variableName,
  data,
  processName,
  formId,
) => ({
  type: types.SUBMIT_TO_WORKFLOW,
  processKey,
  variableName,
  data,
  processName,
  formId,
});

const submitToWorkflowSuccess = payload => ({
  type: types.SUBMIT_TO_WORKFLOW_SUCCESS,
  payload,
});

const submitToWorkflowFailure = () => ({
  type: types.SUBMIT_TO_WORKFLOW_FAILURE,
});

export {
  fetchExtendedStaffDetails,
  fetchExtendedStaffDetailsSuccess,
  fetchExtendedStaffDetailsFailure,
  fetchProcessDefinition,
  fetchProcessDefinitionSuccess,
  fetchProcessDefinitionFailure,
  clearProcessDefinition,
  fetchForm,
  fetchFormWithContext,
  fetchFormSuccess,
  fetchFormFailure,
  submit,
  submitSuccess,
  submitFailure,
  submitToWorkflow,
  submitToWorkflowSuccess,
  submitToWorkflowFailure,
};
