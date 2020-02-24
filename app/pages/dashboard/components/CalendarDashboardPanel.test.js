import React from 'react';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { CalendarDashboardPanel } from './CalendarDashboardPanel';


describe('Calendar Dashboard Panel', () => {
  const mockStore = configureStore();
  let store;
  const initialState = {
    'calendar-page': {},
  };
  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders calendar dashboard panel', async () => {
    const props = {
      hasActiveShift: true,
    };
    const wrapper = await mount(<CalendarDashboardPanel
      store={store}
      {...props}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('navigates to calendar page on click', async () => {
    const history = createMemoryHistory('/calendar');

    const props = {
      history,
      hasActiveShift: true,
    };
    const wrapper = await mount(<Router history={history}>
      <CalendarDashboardPanel
        store={store}
        {...props}
      />
                                </Router>);

    const calendarPageLink = wrapper.find('#calendarPageLink');
    expect(calendarPageLink.exists()).toEqual(true);

    calendarPageLink.simulate('click');
    expect(props.history.location.pathname).toEqual('/calendar');
  });
});
