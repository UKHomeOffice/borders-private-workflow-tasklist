import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map, List, Set } from 'immutable';
import moment from 'moment';
import {MemoryRouter, Switch} from "react-router";
import AppConstants from '../../../common/AppConstants';
import { MessagesPage } from './MessagesPage';
import {RouteWithTitle} from "../../../core/Main";

describe('MessagesPage', () => {
  const initialState = {
    'notification-page': new Map({
      isFetching: false,
      notifications: List([]),
      total: 0,
      nextPage: null,
      hasMoreItems: false,
      pageSize: null,
      acknowledgingTaskIds: Set([]),
    }),
  };
  let mocks;

  beforeEach(() => {
    mocks = {
      acknowledgeNotification: jest.fn(),
      clearNotifications: jest.fn(),
      fetchNotifications: jest.fn(),
      fetchNotificationsNextPage: jest.fn(),
      store: configureStore()(initialState),
    };
  });

  it('sets document title as expected', done => {
    const props = {
      isFetching: true,
      notifications: new List([]),
      ...mocks,
    };

    mount(<MemoryRouter initialEntries={['/messages']}>
      <Switch>
        <RouteWithTitle
          name="Message"
          title={`Operational messages | ${AppConstants.APP_NAME}`}
          exact
          path={AppConstants.MESSAGES_PATH}
          component={() => <MessagesPage {...props} />}
        />

      </Switch>
    </MemoryRouter>);
    requestAnimationFrame(() => {
      expect(document.title).toBe(
          `Operational messages | ${AppConstants.APP_NAME}`,
      );
      done();
    });
  });

  it('renders loading when fetching messages', async () => {
    const props = {
      isFetching: true,
      notifications: new List([]),
      ...mocks,
    };
    const wrapper = await mount(
      <MessagesPage {...props} />,
    );
    const loadingWrapper = wrapper.find('#loadingMessages');
    expect(loadingWrapper.text()).toEqual('Loading messages...');
    expect(mocks.fetchNotifications).toBeCalled();

    wrapper.unmount();
    expect(mocks.clearNotifications).toBeCalled();
  });

  it('renders notifications', async () => {
    const props = {
      isFetching: false,
      notifications: Immutable.fromJS([
        {
          task: {
            id: 'id',
            description: 'description',
            priority: 1000,
            name: 'name',
            created: moment(),
          },
        },
      ]),
      hasMoreItems: false,
      total: 1,
      acknowledgingTaskIds: new List([]),
      ...mocks,
    };
    const wrapper = await mount(
      <MessagesPage {...props} />,
    );

    const messagesCountWrapper = wrapper.find('#numberOfMessages');
    expect(messagesCountWrapper.text()).toEqual('Operational messages1 messages');

    const flashCardWrapper = wrapper.find('#messageName');
    expect(flashCardWrapper.find('h3').text()).toEqual(
      '!WarningEmergency: name',
    );
    expect(wrapper.find('#messageCreated').text()).toEqual('a few seconds ago');
    expect(wrapper.find('button').text()).toEqual('Acknowledge');

    wrapper.unmount();
    expect(mocks.clearNotifications).toBeCalled();
  });
});
