/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import UnauthorizedPage from './UnauthorizedPage';

describe('Unauthorized page', () => {
  it('renders authorized text', async () => {
    const wrapper = shallow(<UnauthorizedPage />);
    expect(wrapper.find('#error-summary-title').text()).toEqual('You are not authorized to access the platform');
  });
});
