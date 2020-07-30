import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import { DashboardTitle } from './DashboardTitle';

describe('DashboardTitle', () => {
  let props;

  beforeEach(() => {
    props = {
      isFetchingShift: false,
      hasActiveShift: true,
      shift: Immutable.fromJS({
        shiftid: 'shiftid',
      }),
      kc: {
        tokenParsed: {
          given_name: 'Givenname',
          family_name: 'Familyname'
        },
      },
      store: configureStore()({}),
    };
  });

  it('renders the title section correctly', async () => {
    const wrapper = await mount(<DashboardTitle {...props} />);

    const dashboardTitle = wrapper.find('#dashboardTitle');
    expect(dashboardTitle.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
