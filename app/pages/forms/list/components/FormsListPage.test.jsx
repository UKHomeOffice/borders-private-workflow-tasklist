import React from 'react';
import configureStore from 'redux-mock-store';
import Immutable, { Map, List } from 'immutable';
import AppConstants from '../../../../common/AppConstants';
import { FormsListPage } from './FormsListPage';
import {MemoryRouter, Switch} from "react-router";
import {RouteWithTitle} from "../../../../core/Main";


describe('FormsListPage', () => {
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

  it('sets document title as expected', (done) => {
    const props = {
      isFetchingProcessDefinitions: true,
      processDefinitions: List([]),
      ...mocks,
    };

    mount(<MemoryRouter initialEntries={['/forms']}>
      <Switch>
        <RouteWithTitle name="Forms"
                        title={`Operational forms | ${AppConstants.APP_NAME}` }
                        exact path={AppConstants.FORMS_PATH}
                        component={() => <FormsListPage {...props} />}/>

      </Switch>

    </MemoryRouter>);

    requestAnimationFrame(() => {
      expect(document.title).toBe(
          `Operational forms | ${AppConstants.APP_NAME}`,
      );
      done();
    });

  });

  it('renders loading when fetching data', () => {
    const props = {
      isFetchingProcessDefinitions: true,
      processDefinitions: List([]),
      ...mocks,
    };
    const wrapper = shallow(<FormsListPage {...props} />);
    expect(mocks.fetchProcessDefinitions).toBeCalled();
    expect(wrapper.find('#proceduresCountLabel').text()).toEqual('Operational forms0 forms');
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
    expect(wrapper.find('#proceduresCountLabel').text()).toEqual('Operational forms2 forms');

    const rows = wrapper.find('#form');
    expect(rows.length).toEqual(2);

    expect(
      wrapper
        .find('#formDescription')
        .first()
        .text(),
    ).toEqual('processADescription');
    expect(
      wrapper
        .find('#formDescription')
        .last()
        .text(),
    ).toEqual('processBDescription');
  });
});
