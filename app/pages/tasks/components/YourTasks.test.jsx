import moment from 'moment';
import { createMemoryHistory } from 'history';
import {MemoryRouter, Router, Switch} from 'react-router-dom';
import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map } from 'immutable';
import AppConstants from '../../../common/AppConstants';
import { YourTasksContainer } from './YourTasksContainer';
import YourTasks from './YourTasks';
import TaskUtils from './TaskUtils';
import {RouteWithTitle} from "../../../core/Main";

jest.useFakeTimers();

describe('YourTasks Page', () => {
  let store;
  const date = moment();
  const yourTasks = Immutable.fromJS({
    isFetchingTasksAssignedToYou: false,
    yourTasksSortValue: 'sort=due,desc',
    appConfig: {
      uiEnvironment: 'local',
    },
    kc: {
      token: 'token',
    },
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
        'process-definition': {
          category: 'Category A',
        },
      },
      {
        task: {
          id: 'idApples',
          name: 'test',
          priority: 1000,
          due: date,
          created: date,
        },
        'process-definition': {
          category: 'Apples A',
        },
      },
      {
        task: {
          id: 'idZoo',
          name: 'test',
          priority: 1000,
          due: date,
          created: date,
        },
        'process-definition': {
          category: 'Zoo',
        },
      },
      {
        task: {
          id: 'idAC',
          name: 'test',
          priority: 1000,
          due: date,
          created: date,
        },
        'process-definition': {
          category: 'Other OPS',
        },
      },
      {
        task: {
          id: 'idA',
          name: 'test',
          priority: 1000,
          due: date,
          created: date,
        },
        'process-definition': null,
      },
    ],
  });
  beforeEach(() => {
    store = configureStore()({
      'tasks-page': new Map({}),
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
  const fetchTasksAssignedToYou = jest.fn();

  it('sets document title as expected', done => {
    const taskUtil = new TaskUtils();
    const props = {
      filterTasksByName: jest.fn(),
      goToTask: jest.fn(),
      sortYourTasks: jest.fn(),
      yourTasks: taskUtil.applyGrouping('category', [
        {
          task: {
            id: 'idZoo',
            name: 'test',
            priority: 1000,
            due: date,
            created: date,
          },
          'process-definition': {
            category: 'Zoo',
          },
        },
      ]),
    };

    mount(<MemoryRouter initialEntries={['/your-tasks']}>
      <Switch>
        <RouteWithTitle
          name="Your tasks"
          title={`Your tasks | ${AppConstants.APP_NAME}`}
          exact
          path={AppConstants.YOUR_TASKS_PATH}
          component={() => <YourTasks {...props} />}
        />

      </Switch>
    </MemoryRouter>);
    requestAnimationFrame(() => {
      expect(document.title).toBe(
          `Your tasks | ${AppConstants.APP_NAME}`,
      );
      done();
    });
  });

  it('renders loading when getting your tasks', async () => {
    const props = {
      appConfig: {
        uiEnvironment: 'local',
      },
      kc: {
        tokenParsed: {
          email: 'test@tes.com',
        },
        token: 'token',
      },
      yourTasks: Immutable.fromJS({
        isFetchingTasksAssignedToYou: true,
      }),
    };
    const wrapper = await mount(
      <YourTasksContainer
        store={store}
        {...props}
        fetchTasksAssignedToYou={fetchTasksAssignedToYou}
      />,
    );
    expect(wrapper.find('.loader-content').exists()).toEqual(true);
    expect(wrapper.find('.loader-message').text()).toEqual(
      'Fetching tasks assigned to you',
    );
  });

  it('renders your tasks', async () => {
    const props = {
      appConfig: {
        uiEnvironment: 'local',
      },
      kc: {
        tokenParsed: {
          email: 'test@tes.com',
        },
        token: 'token',
      },
      yourTasks,
    };
    const wrapper = await mount(
      <YourTasksContainer
        store={store}
        {...props}
        fetchTasksAssignedToYou={fetchTasksAssignedToYou}
      />,
    );

    expect(fetchTasksAssignedToYou).toBeCalled();
    expect(wrapper.find('.loader-content').exists()).toEqual(false);
    expect(wrapper.find('#yourTasksTotalCount').text()).toEqual(
      'Your tasks1 task assigned to you',
    );
    const rows = wrapper.find('#taskGroups');
    expect(rows.length).toEqual(5);
  });

  it('renders your tasks on sort change', async () => {
    const props = {
      appConfig: {
        uiEnvironment: 'local',
      },
      kc: {
        tokenParsed: {
          email: 'test@tes.com',
        },
        token: 'token',
      },
      yourTasks,
    };
    const wrapper = await mount(
      <YourTasksContainer
        store={store}
        {...props}
        fetchTasksAssignedToYou={fetchTasksAssignedToYou}
      />,
    );

    expect(fetchTasksAssignedToYou).toBeCalled();

    const sortTaskInput = wrapper.find('#sortTask');
    sortTaskInput.simulate('change', {
      target: { value: 'sort=created,desc' },
    });
    expect(fetchTasksAssignedToYou).toBeCalledWith(
      'sort=created,desc',
      undefined,
      true,
    );

    sortTaskInput.simulate('change', { target: { value: 'sort=test,desc' } });
    expect(fetchTasksAssignedToYou).toBeCalledWith(
      'sort=test,desc',
      undefined,
      true,
    );
  });

  it('renders your tasks on filter value', async () => {
    const props = {
      appConfig: {
        uiEnvironment: 'local',
      },
      kc: {
        tokenParsed: {
          email: 'test@tes.com',
        },
        token: 'token',
      },
      yourTasks,
    };
    const wrapper = await mount(
      <YourTasksContainer
        store={store}
        {...props}
        fetchTasksAssignedToYou={fetchTasksAssignedToYou}
      />,
    );

    expect(fetchTasksAssignedToYou).toBeCalled();
    const yourTaskFilterInput = wrapper.find('#filterTaskName');

    yourTaskFilterInput.simulate('change', { target: { value: 'ABC' } });
    jest.advanceTimersByTime(600);
    expect(fetchTasksAssignedToYou).toBeCalledWith(
      'sort=due,desc',
      'ABC',
      true,
    );

    yourTaskFilterInput.simulate('change', { target: { value: 'APPLES' } });
    jest.advanceTimersByTime(600);
    expect(fetchTasksAssignedToYou).toBeCalledWith(
      'sort=due,desc',
      'APPLES',
      true,
    );
  });

  it('navigates to task', async () => {
    const history = createMemoryHistory('/task');

    const props = {
      appConfig: {
        uiEnvironment: 'local',
      },
      kc: {
        tokenParsed: {
          email: 'test@tes.com',
        },
        token: 'token',
      },
      history,
      yourTasks: Immutable.fromJS({
        isFetchingTasksAssignedToYou: false,
        yourTasksSortValue: 'sort=due,desc',
        yourTasksFilterValue: 'TEST',
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
      <Router history={history}>
        <YourTasksContainer
          store={store}
          {...props}
          fetchTasksAssignedToYou={fetchTasksAssignedToYou}
        />
      </Router>,
    );

    const idLink = wrapper.find('#actionButton').first();
    expect(idLink.exists()).toEqual(true);

    idLink.simulate('click');
    expect(props.history.location.pathname).toEqual('/task/id');
  });
});
