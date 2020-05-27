import React from 'react';
import { ReportPage } from './ReportPage';

describe('Report Page', () => {
  it('renders back button', () => {
    const props = {
      appConfig: {
        reportServiceUrl: 'http://localhost:9000',
      },
      location: {
        state: {
          htmlName: 'HTML Report',
          name: 'Report',
        },
      },
    };
    const wrapper = shallow(<ReportPage {...props} />);
    expect(wrapper.find('#backToReports').exists()).toEqual(true);
  });

  it('renders an HTMLReport for HTML reports', () => {
    const props = {
      appConfig: {
        reportServiceUrl: 'http://localhost:9000',
      },
      location: {
        state: {
          htmlName: 'HTML Report',
          name: 'Report',
        },
      },
    };
    const wrapper = shallow(<ReportPage {...props} />);
    expect(wrapper.find('HTMLReport').exists()).toEqual(true);
  });

  it('renders a PowerBIReport for Power BI reports', () => {
    const props = {
      appConfig: {
        reportServiceUrl: 'http://localhost:9000',
      },
      location: {
        state: {
          accessToken: 'xxx',
          embedUrl: 'http://www.example.com',
          id: 'abc',
          name: 'Report',
          reportType: 'PowerBIReport',
        },
      },
    };
    const wrapper = shallow(<ReportPage {...props} />);
    expect(wrapper.find('PowerBIReport').exists()).toEqual(true);
  });

  it('renders a redirect if no location.state found', () => {
    const props = {
      appConfig: {
        reportServiceUrl: 'http://localhost:9000',
      },
      location: {},
    };
    const wrapper = shallow(<ReportPage {...props} />);
    expect(wrapper.find('Redirect').exists()).toEqual(true);
  });

  it('matches snapshot', () => {
    const props = {
      appConfig: {
        reportServiceUrl: 'http://localhost:9000',
      },
      location: {},
    };
    const wrapper = shallow(<ReportPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
