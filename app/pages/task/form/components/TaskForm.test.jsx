import React from 'react';
import Immutable from 'immutable';
import AppConstants from '../../../../common/AppConstants';
import TaskForm from './TaskForm';
import form from './fixtures';

let props;

describe('TaskForm Component', () => {
  beforeEach(() => {
    props = {
      appConfig: {},
      form,
      formReference: jest.fn(),
      history: {
        replace: jest.fn(),
      },
      kc: {
        token: 'token',
        tokenParsed: {
          email: 'yesy',
          family_name: 'test',
          given_name: 'name',
          session_state: 'state',
        },
      },
      onCustomEvent: jest.fn(),
      onSubmitTaskForm: jest.fn(),
      task: Immutable.fromJS({
        assignee: null,
        name: 'testTask',
      }),
    };
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<TaskForm {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('changes history prop when handleCancel called', () => {
    const wrapper = shallow(<TaskForm {...props} />);
    wrapper.instance().handleCancel(() => {});
    expect(props.history.replace).toHaveBeenCalledTimes(1);
    expect(props.history.replace).toHaveBeenCalledWith(
      AppConstants.DASHBOARD_PATH,
    );
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<TaskForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
