import React from 'react';
import HTMLReport from './HTMLReport';

describe('HTMLReport', () => {
  const props = {
    reportServiceUrl: 'http://localhost:9000',
    htmlName: 'HTML Report',
  };

  it('renders an HTMLReport', () => {
    const wrapper = shallow(<HTMLReport {...props} />);
    expect(wrapper.find('Iframe').exists()).toEqual(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<HTMLReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
