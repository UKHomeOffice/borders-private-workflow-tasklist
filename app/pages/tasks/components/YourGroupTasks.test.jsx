import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map } from 'immutable';
import moment from 'moment';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import AppConstants from '../../../common/AppConstants';
import { YourGroupTasksContainer } from './YourGroupTasksContainer';

jest.useFakeTimers();

describe('YourGroupTasksContainer Page', () => {
  const mockStore = configureStore();
  let store;
  const date = moment();
  const yourGroupTasks = Immutable.fromJS({
    isFetchingYourGroupTasks: false,
    yourGroupTasksSortValue: 'sort=due,desc',
    total: 1,
    tasks: [
      {
        task: {
          id: 'id',
          name: 'test',
          priority: 1000,
          due: date,
          created: date,
          assignee: 'test@test.com',
        },
      },
    ],
  });
  beforeEach(() => {
    store = mockStore({
      'tasks-page': new Map({}),
      'task-page': new Map({}),
      keycloak: {
        tokenParsed: {
          email: 'test@test.com',
        },
      },
    });
    window.matchMedia = window.matchMedia
    || function matchMedia() {
      return {
        matches: true,
        addListener() {},
        removeListener() {},
      };
    };
  });
  afterEach(() => {
    window.matchMedia = null;
  });
  const fetchYourGroupTasks = jest.fn();

  it('sets document title as expected', () => {
    const props = {
      yourGroupTasks: Immutable.fromJS({
        isFetchingYourGroupTasks: true,
      }),
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
    };
    shallow(
      <YourGroupTasksContainer
        store={store}
        {...props}
        fetchYourGroupTasks={fetchYourGroupTasks}
      />,
    );
    expect(global.window.document.title).toBe(
      `Tasks assigned to your team | ${AppConstants.APP_NAME}`,
    );
  });

  it('renders data spinner while loading tasks', async () => {
    const props = {
      yourGroupTasks: Immutable.fromJS({
        isFetchingYourGroupTasks: true,
      }),
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
    };
    const wrapper = await mount(
      <YourGroupTasksContainer
        {...props}
        {...{ store, fetchYourGroupTasks }}
      />,
    );
    expect(fetchYourGroupTasks).toBeCalled();
    expect(wrapper.find('.loader-content').exists()).toEqual(true);
    expect(wrapper.find('.loader-message').text()).toEqual(
      'Fetching your group tasks',
    );
  });

  it('renders your group tasks', async () => {
    const history = createMemoryHistory('/your-tasks');

    const props = {
      history,
      yourGroupTasks,
      kc: {
        tokenParsed: {
          email: 'test@test.com',
        },
      },
    };
    const wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <YourGroupTasksContainer
            {...props}
            {...{ store, fetchYourGroupTasks }}
          />
        </Router>
      </Provider>,
    );

    expect(fetchYourGroupTasks).toBeCalled();
    expect(wrapper.find('.loader-content').exists()).toEqual(false);
    expect(wrapper.find('#yourGroupTasksTotalCount').text()).toEqual(
      '1 task allocated to your team',
    );
    const rows = wrapper.find('#taskGroups');
    expect(rows.length).toEqual(1);
  });

  it('renders your group tasks on filter value', async () => {
    const history = createMemoryHistory('/your-tasks');

    const props = {
      history,
      yourGroupTasks,
      kc: {
        tokenParsed: {
          email: 'test@test.com',
        },
      },
    };
    const wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <YourGroupTasksContainer
            {...props}
            {...{ store, fetchYourGroupTasks }}
          />
        </Router>
      </Provider>,
    );

    expect(fetchYourGroupTasks).toBeCalled();
    const filterInput = wrapper.find('#filterTaskName');

    filterInput.simulate('change', { target: { value: 'ABC' } });
    jest.advanceTimersByTime(600);
    expect(fetchYourGroupTasks).toBeCalledWith('sort=due,desc', 'ABC', true);

    filterInput.simulate('change', { target: { value: 'APPLES' } });
    jest.advanceTimersByTime(600);
    expect(fetchYourGroupTasks).toBeCalledWith('sort=due,desc', 'APPLES', true);
  });

  it('executes timer', async () => {
    const history = createMemoryHistory('/your-tasks');

    const props = {
      history,
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      yourGroupTasks: Immutable.fromJS({
        isFetchingTasksAssignedToYou: false,
        yourGroupTasksSortValue: 'sort=due,desc',
        yourGroupTasksFilterValue: 'TEST',
        total: 1,
        tasks: [
          {
            task: {
              id: 'id',
              name: 'test',
              priority: 1000,
              due: date,
              created: date,
            },
          },
        ],
      }),
    };

    const wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <YourGroupTasksContainer
            {...props}
            {...{ store, fetchYourGroupTasks }}
          />
        </Router>
      </Provider>,
    );

    expect(fetchYourGroupTasks).toBeCalledWith('sort=due,desc', null, false);

    // kick off timer
    jest.advanceTimersByTime(AppConstants.ONE_MINUTE);
    expect(fetchYourGroupTasks).toBeCalledWith('sort=due,desc', 'TEST', true);

    //
    wrapper.unmount();
    expect(clearTimeout).toBeCalled();
  });

  it('displays claim button if assignee not user', async () => {
    const history = createMemoryHistory('/your-tasks');

    const props = {
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      history,
      claimSuccessful: true,
      yourGroupTasks: Immutable.fromJS({
        isFetchingTasksAssignedToYou: false,
        yourGroupTasksSortValue: 'sort=due,desc',
        yourGroupTasksFilterValue: 'TEST',
        total: 1,
        tasks: [
          {
            task: {
              id: 'id',
              name: 'test',
              priority: 1000,
              due: date,
              created: date,
            },
          },
        ],
      }),
    };

    const wrapper = await mount(
      <Provider store={store}>
        <Router history={history}>
          <YourGroupTasksContainer
            {...props}
            {...{ store, fetchYourGroupTasks }}
          />
        </Router>
      </Provider>,
    );

    const unclaimButton = wrapper.find('input').first();
    expect(unclaimButton.exists()).toEqual(true);
  });
});
