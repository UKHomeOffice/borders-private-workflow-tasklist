import configureStore from 'redux-mock-store';
import React from 'react';
import Immutable from 'immutable';
import DataSpinner from '../components/DataSpinner';
import WithOnboardingCheck from './withOnboardingCheck';

const { Map } = Immutable;

describe('withOnboardingCheck', () => {
  it('Displays data spinner while performing onboarding check', () => {
    const initialState = {
      'shift-page': new Map({
        isCheckingOnBoarding: true,
      }),
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);

    const wrapper = shallow(
      <WithOnboardingCheck store={store}>
        <div>Hello</div>
      </WithOnboardingCheck>,
    );
    expect(wrapper.containsMatchingElement(DataSpinner)).toEqual(true);
  });
});
