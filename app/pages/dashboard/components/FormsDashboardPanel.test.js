import React from 'react';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { FormsDashboardPanel } from './FormsDashboardPanel';

describe('Procedures Dashboard Panel', () => {
  const mockStore = configureStore();
  let store;
  const initialState = {
    'procedures-page': {},
  };
  beforeEach(() => {
    store = mockStore(initialState);
  });
  it('renders forms dashboard panel', async () => {
    const props = {};
    const wrapper = await mount(<FormsDashboardPanel
      store={store}
      {...props}
    />);
    expect(wrapper).toMatchSnapshot();
  });
  it('navigates to forms page on click', async () => {
    const history = createMemoryHistory('/forms');

    const props = {
      history,
      hasActiveShift: true,
    };
    const wrapper = await mount(<Router history={history}>
      <FormsDashboardPanel
        store={store}
        {...props}
      />
                                </Router>);

    const proceduresPageLink = wrapper.find('#proceduresPageLink');
    expect(proceduresPageLink.exists()).toEqual(true);

    proceduresPageLink.simulate('click');
    expect(props.history.location.pathname).toEqual('/forms');
  });
});
