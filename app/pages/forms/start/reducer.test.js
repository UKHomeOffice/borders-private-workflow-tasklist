import Immutable from 'immutable';
import * as actions from './actions';
import reducer from './reducer';

describe('Start Form Reducer', () => {
  const { initialState } = reducer;

  it('captures dispatch to fetch form', () => {
    const state = reducer(initialState, actions.fetchForm('formName'));
    expect(state)
      .toEqual(Immutable.fromJS({
        isFetchingProcessDefinition: true,
        processDefinition: {},
        loadingForm: true,
        form: null,
        submissionStatus: 'NOT_SUBMITTED',
        submissionResponse: null
      }));
  });
  it('captures successful form fetch', () => {
    const formObject = {
      name: 'testForm',
      components: [
        {
          key: 'key',
        },
      ],
    };
    const state = reducer(initialState, actions.fetchFormSuccess({
      entity: formObject,
    }));
    expect(state.get('form')).toEqual(formObject);
    expect(state.get('loadingForm')).toEqual(false);
  });
  it('captures unsuccessful form fetch', () => {
    const state = reducer(initialState, actions.fetchFormFailure());
    expect(state.get('loadingForm')).toEqual(false);
  });
  it('captures form submit', () => {
    const state = reducer(initialState, actions.submit(
      'formId', 'processKey', 'variableName', {}, 'processName',
    ));
    expect(state.get('submissionStatus')).toEqual('SUBMITTING');
  });
  it('captures form submit failure', () => {
    const state = reducer(initialState, actions.submitFailure());
    expect(state.get('submissionStatus')).toEqual('FAILED');
  });
  it('captures form submit to workflow', () => {
    const state = reducer(initialState, actions.submitToWorkflow(
      'processKey', 'variableName', {}, 'processName',
    ));
    expect(state.get('submissionStatus')).toEqual('SUBMITTING');
  });
  it('captures successful submit to workflow', () => {
    const state = reducer(initialState, actions.submitToWorkflowSuccess({
       entity : {
         processInstance: {}
       }
    }));
    expect(state.get('submissionStatus')).toEqual('SUBMISSION_SUCCESSFUL');
  });
  it('captures failure to submit to workflow', () => {
    const state = reducer(initialState, actions.submitToWorkflowFailure());
    expect(state.get('submissionStatus')).toEqual('FAILED');
  });
});
