import React from 'react';
import UnsupportedPage from './UnsupportedPage';

describe('UnsupportedPage page', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<UnsupportedPage />);
    expect(wrapper.exists()).toBe(true);
  });
  it('matches snapshot', () => {
    const wrapper = shallow(<UnsupportedPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
