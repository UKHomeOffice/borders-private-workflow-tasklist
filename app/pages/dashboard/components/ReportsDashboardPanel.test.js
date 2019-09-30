import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ReportsDashboardPanel } from './ReportsDashboardPanel';

describe('Reports Dashboard Panel', () => {
  const mockStore = configureStore();
  let store;
  const initialState = {
    'calendar-page': {},
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders reports dashboard panel', async () => {
    const props = {};
    const wrapper = await mount(<ReportsDashboardPanel
      store={store}
      {...props}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('navigates to reports page on click', async () => {
    const history = createMemoryHistory('/reports');

    const props = {
      history,
      hasActiveShift: true,
    };
    const wrapper = await mount(<Router history={history}>
      <ReportsDashboardPanel
        store={store}
        {...props}
      />
    </Router>);

    const reportsPageLink = wrapper.find('#reportsPageLink');
    expect(reportsPageLink.exists()).toEqual(true);

    reportsPageLink.simulate('click');
    expect(props.history.location.pathname).toEqual('/reports');
  });
});
