import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import { CompleteTaskForm } from './CompleteTaskForm';
import taskForm from './fixtures';

const { Map } = Immutable;

describe('CompleteTaskForm Component', () => {
  const initialState = {
    'task-form': new Map({
      loadingTaskForm: false,
      form: null,
      submittingToFormIO: false,
      submissionToFormIOSuccessful: false,
      submittingTaskFormForCompletion: false,
      taskFormCompleteSuccessful: null,
      customEventSuccessfullyExecuted: false,
      submittingCustomEvent: false,
    }),
  };
  const mockStore = configureStore();
  let store;
  beforeEach(() => {
    store = mockStore(initialState);
  });
  const fetchTaskForm = jest.fn();
  const resetForm = jest.fn();
  const submitTaskForm = jest.fn();
  const unclaimTask = jest.fn();
  const customEvent = jest.fn();

  it('renders loading text', async () => {
    const props = {
      formName: 'testForm',
      loadingTaskForm: true,
      task: Immutable.fromJS({
        assignee: null,
        name: 'testTask',
      }),
    };
    const wrapper = await mount(
      <CompleteTaskForm
        store={store}
        {...props}
        fetchTaskForm={fetchTaskForm}
        resetForm={resetForm}
        submitTaskForm={submitTaskForm}
        unclaimTask={unclaimTask}
        customEvent={customEvent}
      />,
    );
    console.log(wrapper.debug());
    expect(fetchTaskForm).toBeCalled();
    expect(wrapper.name()).toEqual('CompleteTaskForm');
    expect(wrapper.html()).toEqual('<div id="dataSpinner"><div class="loader-content"><div color="black" style="color: black;" class="sk-fade-in sk-spinner line-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div><div class="loader-message"><strong class="govuk-!-font-weight-bold">Loading form for task...</strong></div></div>');
    wrapper.unmount();
    expect(resetForm).toBeCalled();
  });

  it('renders task form', async () => {
    const props = {
      formName: 'testForm',
      loadingTaskForm: false,
      form: taskForm,
      task: Immutable.fromJS({
        assignee: null,
        name: 'testTask',
      }),
      variables: {

      },
    };
    const wrapper = await shallow(
      <CompleteTaskForm
        store={store}
        {...props}
        fetchTaskForm={fetchTaskForm}
        resetForm={resetForm}
        submitTaskForm={submitTaskForm}
        unclaimTask={unclaimTask}
        customEvent={customEvent}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
