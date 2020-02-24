import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import PubSub from 'pubsub-js';
import { TaskCountPanel } from './TaskCountPanel';

const { Map } = Immutable;


jest.mock('pubsub-js', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  publish: jest.fn(),
}));


describe('TaskCountPanel', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({});
  });
  const fetchTaskCounts = jest.fn();
  const setDefaultCounts = jest.fn();

  it('renders default value if no active shift', async () => {
    const props = {
      hasActiveShift: false,
      taskCounts: new Map({
        tasksAssignedToUser: 0,
        tasksUnassigned: 0,
        totalTasksAllocatedToTeam: 0,
      }),
    };
    const wrapper = await mount(<TaskCountPanel
      store={store}
      {...props}
      fetchTaskCounts={fetchTaskCounts}
      setDefaultCounts={setDefaultCounts}
    />);
    expect(setDefaultCounts).toBeCalled();
    expect(fetchTaskCounts).not.toBeCalled();

    const yourTasksPanel = wrapper.find('#yourTasksPanel');
    expect(yourTasksPanel.exists()).toEqual(true);
    expect(yourTasksPanel.find('li span').first().text()).toEqual('0');


    const youTeamTasks = wrapper.find('#youTeamTasks');
    expect(youTeamTasks.exists()).toEqual(true);
    expect(youTeamTasks.find('li span').first().text()).toEqual('0');
  });
  it('renders values when shift active', async () => {
    const props = {
      hasActiveShift: true,
      taskCounts: new Map({
        tasksAssignedToUser: 10,
        tasksUnassigned: 1,
        totalTasksAllocatedToTeam: 10,
      }),
    };
    const wrapper = await mount(<TaskCountPanel
      store={store}
      {...props}
      fetchTaskCounts={fetchTaskCounts}
      setDefaultCounts={setDefaultCounts}
    />);
    expect(fetchTaskCounts).toBeCalled();
    expect(PubSub.subscribe).toBeCalled();


    const yourTasksPanel = wrapper.find('#yourTasksPanel');
    expect(yourTasksPanel.exists()).toEqual(true);
    expect(yourTasksPanel.find('li span').first().text()).toEqual('10');

    const youTeamTasks = wrapper.find('#youTeamTasks');
    expect(youTeamTasks.exists()).toEqual(true);
    expect(youTeamTasks.find('li span').first().text()).toEqual('10');
  });
});
