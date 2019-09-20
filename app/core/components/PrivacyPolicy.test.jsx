import React from 'react';
import { shallow } from 'enzyme';

// local imports
import PrivacyPolicy from './PrivacyPolicy';

describe('Privacy Policy page', () => {
  it('renders the privacy policy text', () => {
    const wrapper = shallow(<PrivacyPolicy />);
    debugger;
    expect(wrapper.find('.govuk-heading-xl').text()).toEqual('Privacy notice for Home Office Workforce');
  });
});
