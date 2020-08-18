import React from 'react';
import Immutable, { List } from 'immutable';
import Spinner from 'react-spinkit';
import { MemoryRouter, Switch } from 'react-router';
import AppConstants from '../../../common/AppConstants';
import { ReportsPage } from './ReportsPage';
import { RouteWithTitle } from '../../../core/Main';

describe('Reports Page', () => {
  const initialProps = {
    appConfig: {
      productPageUrl: 'http://www.example.com',
    },
    fetchReportsList: jest.fn(),
    history: {
      push: jest.fn(),
    },
    loadingReports: false,
    reports: List([]),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sets document title as expected', done => {
    const props = {
      ...initialProps,
    };

    mount(
      <MemoryRouter initialEntries={['/reports']}>
        <Switch>
          <RouteWithTitle
            name="Reports"
            title={`Operational reports | ${AppConstants.APP_NAME}`}
            exact
            path={AppConstants.REPORTS_PATH}
            component={() => <ReportsPage {...props} />}
          />
        </Switch>
      </MemoryRouter>,
    );
    requestAnimationFrame(() => {
      expect(document.title).toBe(
        `Operational reports | ${AppConstants.APP_NAME}`,
      );
      done();
    });
  });

  it('renders data spinner', async () => {
    const props = {
      ...initialProps,
      loadingReports: true,
    };
    const wrapper = await shallow(<ReportsPage {...props} />);
    expect(props.fetchReportsList).toBeCalled();
    expect(wrapper.find('#reportsCountLabel').text()).toEqual(
      'Operational reports0 reports',
    );
    expect(wrapper.containsMatchingElement(Spinner)).toEqual(true);
  });

  it('renders list of reports', async () => {
    const props = {
      ...initialProps,
      reports: Immutable.fromJS([
        {
          name: 'reportname',
          description: 'reportdescription',
          htmlName: 'reportHtmlName',
        },
      ]),
    };
    const wrapper = await mount(<ReportsPage {...props} />);
    expect(props.fetchReportsList).toBeCalled();
    expect(wrapper.find('#reportsCountLabel').text()).toEqual(
      'Operational reports1 report',
    );

    expect(wrapper.find('#report').length).toEqual(1);
  });

  it('triggers history.push when button is pressed', () => {
    const props = {
      ...initialProps,
      reports: Immutable.fromJS([
        {
          name: 'reportname',
          description: 'reportdescription',
          htmlName: 'reportHtmlName',
        },
      ]),
    };
    const wrapper = shallow(<ReportsPage {...props} />);
    const buttonWrapper = wrapper.find('button').first();
    buttonWrapper.prop('onClick')();
    expect(props.history.push).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const props = {
      ...initialProps,
      loadingReports: true,
    };
    const wrapper = shallow(<ReportsPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
