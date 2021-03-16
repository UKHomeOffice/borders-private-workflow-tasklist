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
        realm: 'cop-test',
        url: 'http://localhost',
        subject: 'd3eb0456-1b82-4c64-a987-7201d9ce9312',
        tokenParsed: {
          email: 'yesy',
          family_name: 'test',
          given_name: 'name',
          session_state: 'state',
          groups: ['/group/one', '/group/two'],
          realm_access: { roles: ['role'] },
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
