import React from 'react';
import PowerBIReport from './PowerBIReport';

describe('PowerBIReport', () => {
  const props = {
    accessToken: 'xxx',
    embedUrl: 'http://www.example.com',
    id: 'abc',
    name: 'Power BI Report',
  };

  it('renders a PowerBIReport', () => {
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper.find('Report').exists()).toEqual(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
