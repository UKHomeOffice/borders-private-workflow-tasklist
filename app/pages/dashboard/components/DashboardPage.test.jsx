import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  let props;

  beforeEach(() => {
    props = {
      isFetchingShift: false,
      hasActiveShift: true,
      shift: Immutable.fromJS({
        shiftid: 'shiftid',
      }),
      store: configureStore()({ 'calendar-page': {} }),
    };
  });


  it('renders panels if shift present', async () => {
    const wrapper = shallow(<DashboardPage {...props} />);

    expect(wrapper.find('DashboardTitle')).toBeDefined();
    expect(wrapper.find('DashboardPanel')).toBeDefined();
  });
});
