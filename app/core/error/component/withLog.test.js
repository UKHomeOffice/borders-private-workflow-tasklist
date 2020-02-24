import React from 'react';
import configureStore from 'redux-mock-store';
import withLog from './withLog';

let store;

class Component extends React.Component {
  render() {
    this.props.log([{
      message: 'hello',
      level: 'info',
      user: 'user',
      path: '/path',
    }]);
    return <div>Hello</div>;
  }
}

describe('withLog', () => {
  beforeEach(() => {
    const mockStore = configureStore();
    store = mockStore({});
  });

  it('has log in wrapped component', async () => {
    const ComponentWithLog = withLog(Component);
    const wrapper = await mount(
      <ComponentWithLog store={store} />,
    );
    const actions = wrapper.props().store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual('LOG');

    expect(actions[0].payload.length).toEqual(1);

    const payload = actions[0].payload[0];
    expect(payload.message).toEqual('hello');
    expect(payload.level).toEqual('info');
    expect(payload.user).toEqual('user');
    expect(payload.path).toEqual('/path');
  });
});
