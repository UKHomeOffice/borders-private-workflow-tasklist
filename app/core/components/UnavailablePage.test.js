/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import UnavailablePage from './UnavailablePage';

describe('Unavailable page', () => {
  it('renders unavailable text', async () => {
    const wrapper = shallow(<UnavailablePage />);
    expect(wrapper.find('#error-summary-title').text()).toEqual('Sorry, the service is unavailable');
  });
});
