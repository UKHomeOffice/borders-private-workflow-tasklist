import React from 'react';
import axios from 'axios';
import { PowerBIReport } from './PowerBIReport';
import secureLocalStorage from '../../../common/security/SecureLocalStorage';

jest.mock('axios');
jest.mock('../../../common/security/SecureLocalStorage', () => ({
  get: jest.fn().mockReturnValue({ team: { branchid: '10' } }),
}));

describe('PowerBIReport', () => {
  const props = {
    accessToken: 'xxx',
    apiRefUrl: 'http://www.example.com',
    embedUrl: 'http://www.example.com',
    id: 'abc',
    name: 'Power BI Report',
    useMobileLayout: true,
    kc: {
      token: 'xyz',
      tokenParsed: {
        email: 'test@example.com',
      },
    },
  };

  it('renders a PowerBIReport', () => {
    axios.mockImplementation(() =>
      Promise.resolve({ data: { data: [{ name: 'Felixstowe' }] } }),
    );
    const wrapper = shallow(<PowerBIReport {...props} />);
    expect(wrapper.find('#report').exists()).toEqual(true);
    expect(secureLocalStorage.get).toHaveBeenCalled();
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
