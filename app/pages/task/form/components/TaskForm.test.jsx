import React from 'react';
import Immutable from 'immutable';
import AppConstants from '../../../../common/AppConstants';
import TaskForm from './TaskForm';
import form from './fixtures';

let formReference, onCustomEvent, onSubmitTaskForm, history;
const task = Immutable.fromJS({
  assignee: null,
  name: 'testTask',
});

const getWrapper = () =>
  shallow(
    <TaskForm
      {...{
        form,
        formReference,
        history,
        onCustomEvent,
        onSubmitTaskForm,
        task,
      }}
    />,
  );

describe('TaskForm Component', () => {
  beforeEach(() => {
    formReference = jest.fn();
    onCustomEvent = jest.fn();
    onSubmitTaskForm = jest.fn();
    history = {
      replace: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    const wrapper = getWrapper();
  });

  it('changes history prop when handleCancel called', () => {
    const wrapper = getWrapper();
    wrapper.instance().handleCancel(() => {});
    expect(history.replace).toHaveBeenCalledTimes(1);
    expect(history.replace).toHaveBeenCalledWith(AppConstants.DASHBOARD_PATH);
  });

  it('matches snapshot', () => {
    const wrapper = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });
});
