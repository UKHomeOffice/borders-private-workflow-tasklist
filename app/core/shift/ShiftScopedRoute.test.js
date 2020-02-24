import { Redirect, Route } from 'react-router';
import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import ShiftScopedRoute from './withShiftCheck';
import DataSpinner from '../components/DataSpinner';
import ErrorHandlingContainer from '../error/component/ErrorHandlingComponent';

const { Map } = Immutable;


describe('Shift Scoped Route', () => {
  it('Displays data spinner while checking shift', () => {
    const initialState = {
      'shift-page': new Map({
        isFetchingShift: true,
      }),
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);

    const wrapper = shallow(
      <ShiftScopedRoute store={store}>
        <div>Hello</div>
      </ShiftScopedRoute>,
    );
    expect(wrapper.containsMatchingElement(DataSpinner)).toEqual(true);
  });
  it('Redirects to dashboard if no shift', () => {
    const initialState = {
      'shift-page': new Map({
        isFetchingShift: false,
        hasActiveShift: false,
      }),
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);

    const wrapper = shallow(
      <ShiftScopedRoute store={store}>
        <div>Hello</div>
      </ShiftScopedRoute>,
    );
    expect(wrapper.containsMatchingElement(Redirect)).toEqual(true);
  });
  it('Renders component if authorised and has shift', () => {
    const initialState = {
      'shift-page': new Map({
        isFetchingShift: false,
        hasActiveShift: true,
      }),
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);

    const wrapper = shallow(
      <ShiftScopedRoute store={store}>
        <div>Hello</div>
      </ShiftScopedRoute>,
    );
    expect(wrapper.containsMatchingElement(Route)).toEqual(true);
    expect(wrapper.containsMatchingElement(ErrorHandlingContainer)).toEqual(true);
  });
});
