import React from 'react';
import configureStore from 'redux-mock-store';
import PubSub from 'pubsub-js';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { MessagesPanel } from './MessagesPanel';

jest.mock('pubsub-js', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  publish: jest.fn(),
}));

describe('MessagesPanel', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  const fetchMessageCounts = jest.fn();
  const setDefaultCounts = jest.fn();
  it('renders default value', async () => {
    const props = {
      hasActiveShift: false,
      isFetchingMessageCounts: false,
      messageCounts: 0,
    };
    const wrapper = await mount(<MessagesPanel
      store={store}
      {...props}
      fetchMessageCounts={fetchMessageCounts}
      setDefaultCounts={setDefaultCounts}
    />);
    expect(setDefaultCounts).toBeCalled();
    expect(fetchMessageCounts).not.toBeCalled();

    const messagesPanel = wrapper.find('#messagesPanel');
    expect(messagesPanel.exists()).toEqual(true);
    expect(messagesPanel.find('#messageCount').text()).toEqual('0');
  });

  it('renders values', async () => {
    const props = {
      hasActiveShift: true,
      isFetchingMessageCounts: false,
      messageCounts: 10,
    };
    const wrapper = await mount(<MessagesPanel
      store={store}
      {...props}
      fetchMessageCounts={fetchMessageCounts}
      setDefaultCounts={setDefaultCounts}
    />);

    expect(fetchMessageCounts).toBeCalled();
    expect(PubSub.subscribe).toBeCalled();

    const messagesPanel = wrapper.find('#messagesPanel');
    expect(messagesPanel.exists()).toEqual(true);
    expect(messagesPanel.find('#messageCount').text()).toEqual('10');
  });
  it('navigates to messages page on click', async () => {
    const history = createMemoryHistory('/messages');

    const props = {
      history,
      hasActiveShift: true,
      isFetchingMessageCounts: false,
      messageCounts: 10,
      log: logs => {
        console.log(`JSON${JSON.stringify(logs)}`);
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
    };
    const wrapper = await mount(<Router history={history}>
      <MessagesPanel
        store={store}
        {...props}
        fetchMessageCounts={fetchMessageCounts}
        setDefaultCounts={setDefaultCounts}
      />
                                </Router>);

    const messagesPageLink = wrapper.find('#messagesPageLink');
    expect(messagesPageLink.exists()).toEqual(true);

    messagesPageLink.simulate('click');
    expect(props.history.location.pathname).toEqual('/messages');
  });
});
