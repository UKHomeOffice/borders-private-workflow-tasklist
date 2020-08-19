import Immutable from 'immutable';
import * as actions from './actionTypes';
import {
  FAILED,
  NOT_SUBMITTED,
  SUBMISSION_SUCCESSFUL,
  SUBMITTING,
} from './constants';

const { Map } = Immutable;

const initialState = new Map({
  isFetchingProcessDefinition: true,
  processDefinition: Map({}),
  loadingForm: true,
  form: null,
  submissionStatus: NOT_SUBMITTED,
  submissionResponse: null,
});

function reducer(state = initialState, action) {
  let processDefinition;
  switch (action.type) {
    case actions.FETCH_PROCESS_DEFINITION:
      return state
        .set('loadingForm', true)
        .set('isFetchingProcessDefinition', true);
    case actions.FETCH_PROCESS_DEFINITION_SUCCESS:
      processDefinition = action.payload.entity ? action.payload.entity : {};
      return state
        .set('isFetchingProcessDefinition', false)
        .set('processDefinition', Immutable.fromJS(processDefinition));
    case actions.FETCH_PROCESS_DEFINITION_FAILURE:
      return state.set('isFetchingProcessDefinition', false);
    case actions.RESET_PROCEDURE:
      return initialState;
    case actions.FETCH_FORM:
      return state.set('loadingForm', true);
    case actions.FETCH_FORM_SUCCESS:
      return state.set('loadingForm', false).set('form', action.payload.entity);
    case actions.FETCH_FORM_FAILURE:
      return state.set('loadingForm', false);

    case actions.SUBMIT:
      return state.set('submissionStatus', SUBMITTING);
    case actions.SUBMIT_FAILURE:
      return state.set('submissionStatus', FAILED);
    case actions.SUBMIT_TO_WORKFLOW || actions.SUBMIT_TO_WORKFLOW_NON_SHIFT:
      return state.set('submissionStatus', SUBMITTING);
    case actions.SUBMIT_TO_WORKFLOW_SUCCESS:
      if (action.payload.entity && action.payload.entity.processInstance) {
        const rawVariables = action.payload.entity.processInstance.variables
          ? action.payload.entity.processInstance.variables
          : {};
        const variables = {};
        Object.keys(rawVariables).forEach(key => {
          if (rawVariables[key].type === 'Json') {
            variables[key] = JSON.parse(rawVariables[key].value);
          } else {
            variables[key] = rawVariables[key].value;
          }
        });
        action.payload.entity.processInstance.variables = variables;
      }
      return state
        .set('submissionStatus', SUBMISSION_SUCCESSFUL)
        .set('submissionResponse', action.payload.entity);
    case actions.SUBMIT_TO_WORKFLOW_FAILURE:
      return state.set('submissionStatus', FAILED);
    default:
      return state;
  }
}

export default reducer;
