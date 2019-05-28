import { shallow } from 'enzyme/build/index';
import { ReportPage } from './ReportPage';
import React from 'react';



describe('Report Page', () => {
  it('renders iframe for report', () => {
    const props = {
      location: {
        search: '?reportName=myReport.html'
      },
      appConfig: {
        reportServiceUrl: 'http://localhost:9000'
      },
    };
    const wrapper = shallow(<ReportPage
      {...props}
    />);
    expect(wrapper.find('#backToReports').exists()).toEqual(true);
    const iframeWrapper = wrapper.find('Iframe');
    expect(iframeWrapper.prop('url')).toEqual(`${props.appConfig.reportServiceUrl}/api/reports/myReport.html`);
  });
});
