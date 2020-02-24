import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map, List } from 'immutable';
import AppConstants from '../../../../common/AppConstants';
import { FormsListPage } from './FormsListPage';

jest.mock('react-device-detect', () => ({
  isMobile: false,
}));

describe('ProceduresPage', () => {
  const initialState = {
    'procedures-list-page': new Map({
      isFetchingProcessDefinitions: true,
      processDefinitions: List([]),
    }),
  };
  let mocks;

  beforeEach(() => {
    mocks = {
      store: configureStore()(initialState),
      fetchProcessDefinitions: jest.fn(),
    };
  });

  it('sets document title as expected', () => {
    const props = {
      isFetchingProcessDefinitions: true,
      processDefinitions: List([]),
      ...mocks,
    };
    shallow(<FormsListPage {...props} />);
    expect(global.window.document.title).toBe(
      `Forms | ${AppConstants.APP_NAME}`,
    );
  });

  it('renders loading when fetching data', () => {
    const props = {
      isFetchingProcessDefinitions: true,
      processDefinitions: List([]),
      ...mocks,
    };
    const wrapper = shallow(<FormsListPage {...props} />);
    expect(mocks.fetchProcessDefinitions).toBeCalled();
    expect(wrapper.find('#proceduresCountLabel').text()).toEqual('0 forms');
    expect(wrapper.find('#loading').text()).toEqual('Loading forms...');
    expect(mocks.fetchProcessDefinitions).toBeCalled();
  });

  it('renders  a list of forms with form view', async () => {
    window.matchMedia = window.matchMedia
    || function matchMedia() {
      return {
        matches: true,
        addListener() {},
        removeListener() {},
      };
    };
    const props = {
      isFetchingProcessDefinitions: false,
      processDefinitions: Immutable.fromJS([
        {
          'process-definition': {
            key: 'processA',
            name: 'processA',
            description: 'processADescription',
          },
        },
        {
          'process-definition': {
            key: 'processB',
            name: 'processB',
            description: 'processBDescription',
          },
        },
      ]),
      ...mocks,
    };
    const wrapper = await mount(<FormsListPage {...props} />);

    expect(mocks.fetchProcessDefinitions).toBeCalled();
    expect(wrapper.find('#proceduresCountLabel').text()).toEqual('2 forms');

    const tableWrapper = wrapper.find('table');
    expect(tableWrapper.exists()).toEqual(true);

    const rows = wrapper.find('.widetable-process');
    expect(rows.length).toEqual(1);

    const firstRowColumns = rows
      .first()
      .find('td')
      .map(column => column.text());
    expect(firstRowColumns.length).toEqual(4);
    expect(firstRowColumns[0]).toEqual('processADescription');

    const map = rows
      .first()
      .find('td')
      .map(column => column);
    const actionButton = map[1];
    expect(actionButton.find('button').text()).toEqual('Start');

    window.matchMedia = null;
  });
});
