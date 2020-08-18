import Immutable from 'immutable';
import * as selectors from './selectors';

const { Map } = Immutable;

describe('reports selector', () => {
  const state = {
    'reports-page': new Map({
      reports: Immutable.fromJS([
        {
          report: 'report',
        },
      ]),
      loadingReports: true,
    }),
    appConfig: {
      productPageUrl: 'http://www.example.com',
    },
  };

  it('can get loadingReports', () => {
    const result = selectors.loadingReports(state);
    expect(result).toEqual(true);
  });

  it('can get reports', () => {
    const result = selectors.reports(state);
    expect(result.size).toEqual(1);
  });

  it('can get appConfig', () => {
    const result = selectors.appConfig(state);
    expect(result.productPageUrl).toEqual('http://www.example.com');
  });
});
