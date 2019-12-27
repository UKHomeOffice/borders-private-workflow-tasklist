import Immutable from 'immutable';
import {
  extendedStaffDetails, form, loadingForm, submissionStatus
} from './selectors';


const { Map } = Immutable;

describe('Start form selector', () => {
  it('should return form', () => {
    const state = {
      'procedure-page': new Map({
        form: {
          name: 'test',
        },
      }),
    };
    const result = form(state);
    expect(result).toEqual(state['procedure-page'].get('form'));
  });
  it('should return loadingForm', () => {
    const state = {
      'procedure-page': new Map({
        loadingForm: true,
      }),
    };
    const result = loadingForm(state);
    expect(result).toEqual(true);
  });
  it('should return submittingToWorkflow', () => {
    const state = {
      'procedure-page': new Map({
        submissionStatus: 'SUBMITTING',
      }),
    };
    const result = submissionStatus(state);
    expect(result).toEqual('SUBMITTING');
  });
  it('should return submission successful', () => {
    const state = {
      'procedure-page': new Map({
        submissionStatus: 'SUBMISSION_SUCCESSFUL',
      }),
    };
    const result = submissionStatus(state);
    expect(result).toEqual('SUBMISSION_SUCCESSFUL');
  });


  it('should return submissionFailed', () => {
    const state = {
      'procedure-page': new Map({
        submissionStatus: 'FAILED',
      }),
    };
    const result = submissionStatus(state);
    expect(result).toEqual('FAILED');
  });
  it('should return extendedStaffDetails', () => {
    const details = [{ test: 'test' }];
    const state = {
      'procedure-page': new Map({
        extendedStaffDetails: details,
      }),
    };
    const result = extendedStaffDetails(state);
    expect(result).toEqual(details);
  });
});
