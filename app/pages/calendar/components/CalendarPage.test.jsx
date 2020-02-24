import React from 'react';
import AppConstants from '../../../common/AppConstants';
import CalendarPage from './CalendarPage';

describe('Calendar Page', () => {
  it('sets document title as expected', () => {
    shallow(<CalendarPage />);
    expect(global.window.document.title).toBe(
      `Calendar | ${AppConstants.APP_NAME}`,
    );
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
