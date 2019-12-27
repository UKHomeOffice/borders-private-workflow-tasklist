import { shallow } from 'enzyme';
import React from 'react';
import { List, Map } from 'immutable';
import DataSpinner from '../../../core/components/DataSpinner';
import withAuthCheck from './withAuthCheck';

describe('withAuthCheck', () => {
  let AuthComponent;
  let props;
  let TestComponent;

  beforeAll(() => {
    TestComponent = () => <div>Test</div>;
  });

  beforeEach(() => {
    props = {
      extendedStaffDetails: null,
      fetchExtendedStaffDetails: jest.fn(() => {}),
      history: {
        replace: jest.fn(),
      },
      kc: {
        tokenParsed: {
          email: 'logged-in-user',
        },
      },
      match: {
        params: {
          staffId: '1234',
        },
      },
    };
    AuthComponent = withAuthCheck(TestComponent);
  });

  it('Displays DataSpinner while performing auth check', () => {
    const wrapper = shallow(<AuthComponent {...props} />);
    expect(wrapper.type()).toBe(DataSpinner);
  });
  it('Calls fetchExtendedStaffDetails with correct staffID on mount', () => {
    shallow(<AuthComponent {...props} />);
    expect(props.fetchExtendedStaffDetails).toHaveBeenCalledWith('1234');
  });
  it("Redirects if logged-in user is not employee's LM or LM delegate", () => {
    const wrapper = shallow(<AuthComponent {...props} />);
    const spy = jest.spyOn(AuthComponent.prototype, 'componentDidUpdate');
    const newProps = {
      extendedStaffDetails: List([
        Map({
          linemanager_delegate_email: 'email',
          linemanager_email: 'email',
        }),
      ]),
    };
    wrapper.setProps(newProps);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(props.history.replace).toHaveBeenCalledTimes(1);
  });
  it('Continues to render DataSpinner if updated with no extendedStaffDetails', () => {
    const wrapper = shallow(<AuthComponent {...props} />);
    const newProps = {
      test: 'data',
    };
    wrapper.setProps(newProps);
    expect(wrapper.type()).toBe(DataSpinner);
  });
  it("Renders component passed if user is employee's line manager", () => {
    const wrapper = shallow(<AuthComponent {...props} />);
    const spy = jest.spyOn(AuthComponent.prototype, 'componentDidUpdate');
    const newProps = {
      extendedStaffDetails: List([
        Map({
          linemanager_email: 'logged-in-user',
        }),
      ]),
    };
    wrapper.setProps(newProps);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(wrapper.type()).toBe(TestComponent);
  });
  it("Renders component passed if user is among employee's delegates", () => {
    const wrapper = shallow(<AuthComponent {...props} />);
    const spy = jest.spyOn(AuthComponent.prototype, 'componentDidUpdate');
    const newProps = {
      extendedStaffDetails: List([
        Map({
          linemanager_delegate_email: ['logged-in-user'],
          linemanager_email: 'email',
        }),
      ]),
    };
    wrapper.setProps(newProps);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(wrapper.type()).toBe(TestComponent);
  });
});
