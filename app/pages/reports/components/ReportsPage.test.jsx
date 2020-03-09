import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map, List } from 'immutable';
import Spinner from 'react-spinkit';
import AppConstants from '../../../common/AppConstants';
import { ReportsPage } from './ReportsPage';
import {MemoryRouter, Switch} from "react-router";
import {RouteWithTitle} from "../../../core/Main";

describe('Reports Page', () => {
  const initialState = {
    'reports-page': new Map({
      loadingReports: false,
      reports: List([]),
    }),
  };
  const store = configureStore()(initialState);

  it('sets document title as expected', (done) => {
    const props = {
      loadingReports: false,
      reports: List([]),
      fetchReportsList: jest.fn(),
      store,
    };

   mount(<MemoryRouter initialEntries={['/reports']}>
      <Switch>
        <RouteWithTitle name="Reports"
                        title={`Operational reports | ${AppConstants.APP_NAME}` }
                        exact path={AppConstants.REPORTS_PATH}
                        component={() => <ReportsPage {...props} />}/>

      </Switch>
    </MemoryRouter>);
    requestAnimationFrame(() => {
      expect(document.title).toBe(
          `Operational reports | ${AppConstants.APP_NAME}`,
      );
      done();
    });

  });

  it('renders data spinner', async () => {
    const props = {
      loadingReports: true,
      reports: List([]),
      fetchReportsList: jest.fn(),
      store,
    };
    const wrapper = await shallow(
      <ReportsPage {...props} />,
    );
    expect(props.fetchReportsList).toBeCalled();
    expect(wrapper.find('#reportsCountLabel').text()).toEqual('Operational reports0 reports');
    expect(wrapper.containsMatchingElement(Spinner)).toEqual(true);
  });

  it('renders list of reports', async () => {
    const props = {
      loadingReports: false,
      reports: Immutable.fromJS([
        {
          name: 'reportname',
          description: 'reportdescription',
          htmlName: 'reportHtmlName',
        },
      ]),
      fetchReportsList: jest.fn(),
      store,
    };
    const wrapper = await mount(
      <ReportsPage {...props} />,
    );
    expect(props.fetchReportsList).toBeCalled();
    expect(wrapper.find('#reportsCountLabel').text()).toEqual('Operational reports1 report');

    expect(wrapper.find('#report').length).toEqual(1)
  });
});
