import React from 'react';

// local imports
import PrivacyPolicy from './PrivacyPolicy';

describe('Privacy Policy page', () => {
  it('renders the privacy policy text', () => {
    const wrapper = shallow(<PrivacyPolicy />);
    expect(wrapper.find('.govuk-heading-xl').text()).toEqual('Privacy notice for Home Office Workforce');
  });
});
