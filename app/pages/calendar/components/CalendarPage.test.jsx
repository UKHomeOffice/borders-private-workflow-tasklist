import React from 'react';
import {MemoryRouter, Switch} from "react-router";
import AppConstants from '../../../common/AppConstants';
import CalendarPage from './CalendarPage';
import {RouteWithTitle} from "../../../core/Main";

describe('Calendar Page', () => {
  it('sets document title as expected', () => {
    mount(<MemoryRouter initialEntries={['/calendar']}>
      <Switch>
        <RouteWithTitle
          name="Calendar"
          title={`Calendar | ${AppConstants.APP_NAME}`}
          exact
          path={AppConstants.CALENDAR_PATH}
          component={() => <CalendarPage  />}
        />

      </Switch>
    </MemoryRouter>);
    requestAnimationFrame(() => {
      expect(document.title).toBe(
          `Calendar | ${AppConstants.APP_NAME}`,
      );
      done();
    });
  });

  it('renders calendar page', () => {
    shallow(<CalendarPage />, {
      attachTo: document.body,
    });
    const toolBar = document.querySelector('.fc-toolbar');
    expect(toolBar).toBeDefined();

    const dayWeekMonth = document.querySelector('.fc-center');
    expect(dayWeekMonth).toBeDefined();

    const viewContainer = document.querySelector('.fc-view-container');
    expect(viewContainer).toBeDefined();
  });
});
