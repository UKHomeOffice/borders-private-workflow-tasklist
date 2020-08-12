import React from 'react';
import PowerBIReport from './PowerBIReport';

describe('PowerBIReport', () => {
  const props = {
    accessToken: 'xxx',
    embedUrl: 'http://www.example.com',
    id: 'abc',
    name: 'Power BI Report',
    useMobileLayout: true,
  };

  it('renders a PowerBIReport', () => {
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper.find('Report').exists()).toEqual(true);
  });

  it('does not render a LogoBar if narrow screen', () => {
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper.find('LogoBar').exists()).toEqual(false);
  });

  it('renders a LogoBar if wide screen', () => {
    const wrapper = shallow(
      <PowerBIReport {...{ ...props, useMobileLayout: false }} />,
    );
    expect(wrapper.find('LogoBar').exists()).toEqual(true);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
