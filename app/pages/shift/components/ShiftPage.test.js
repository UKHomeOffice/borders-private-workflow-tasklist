import { mount } from 'enzyme/build';
import React from 'react';
import Immutable from 'immutable';
import { ShiftPage } from './ShiftPage';
import { ErrorHandlingComponent } from '../../../core/error/component/ErrorHandlingComponent';

describe('Shift page', () => {
  const fetchActiveShift = jest.fn();
  const fetchShiftForm = jest.fn();
  const fetchStaffDetails = jest.fn();
  const fetchExtendedStaffDetails = jest.fn();

  it('renders loading page for props', async () => {
    const props = {
      isFetchingShift: true,
      isFetchingStaffDetails: true,
      isFetchingExtendedStaffDetails: true,
      loadingShiftForm: true,
      submittingActiveShift: false,
      shiftForm: {

      },
      appConfig: {
        apiRefUrl: 'apiRefUrl',
        workflowUrl: 'workflow',
        operationalDataUrl: 'operational',
      },
      kc:  {
        token : 'token',
        refreshToken: 'refreshToken',
        tokenParsed: {
          session_state: 'sessionState',
          email: 'email',
          given_name: 'given_name',
          family_name: 'familyName'
        }
      }
    };
    const wrapper = await mount(<ShiftPage
      {...props}
      fetchActiveShift={fetchActiveShift}
      fetchShiftForm={fetchShiftForm}
      fetchStaffDetails={fetchStaffDetails}
      fetchExtendedStaffDetails={fetchExtendedStaffDetails}
    />);

    expect(fetchStaffDetails).toHaveBeenCalled();
    expect(fetchShiftForm).toHaveBeenCalled();
    expect(fetchStaffDetails).toHaveBeenCalled();
    expect(fetchExtendedStaffDetails).toHaveBeenCalled();

    expect(wrapper.find('#dataSpinner').exists()).toEqual(true);
    expect(wrapper.find('.loader-message').text()).toEqual('Loading your shift details');
  });

  it('renders error panel if submission fails', async () => {
    const props = {
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: true,
      submittingActiveShift: false,
      appConfig: {
        serviceDeskUrls: {
          support: "http://test.com"
        }
      }
    };
    const wrapper = await mount(<ErrorHandlingComponent
        {...props}
      skipAuth
      hasError
      errors={
      Immutable.fromJS([{
        message: 'failed',
      }])
    }
    >
      <ShiftPage
        {...props}
        fetchActiveShift={fetchActiveShift}
        fetchShiftForm={fetchShiftForm}
        fetchStaffDetails={fetchStaffDetails}
        fetchExtendedStaffDetails={fetchExtendedStaffDetails}
      />
    </ErrorHandlingComponent>);

    expect(fetchStaffDetails).toHaveBeenCalled();
    expect(fetchShiftForm).toHaveBeenCalled();
    expect(fetchStaffDetails).toHaveBeenCalled();
    expect(fetchExtendedStaffDetails).toHaveBeenCalled();

    console.log(wrapper.html());

    expect(wrapper.find('.govuk-error-summary').exists()).toEqual(true);
  });

  it('renders submitting once submitted', async () => {
    const props = {
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: false,
      submittingActiveShift: false,
      shiftForm: {

      },
      appConfig: {
        apiRefUrl: 'apiRefUrl',
        workflowUrl: 'workflow',
        operationalDataUrl: 'operational',
      },
      kc:  {
        token : 'token',
        refreshToken: 'refreshToken',
        tokenParsed: {
          session_state: 'sessionState',
          email: 'email',
          given_name: 'given_name',
          family_name: 'familyName'
        }
      }
    };
    const wrapper = await mount(<ShiftPage
      {...props}
      fetchActiveShift={fetchActiveShift}
      fetchShiftForm={fetchShiftForm}
      fetchStaffDetails={fetchStaffDetails}
      fetchExtendedStaffDetails={fetchExtendedStaffDetails}
    />);

    wrapper.setProps({ submittingActiveShift: true });
    const loaderContent = wrapper.find('.Loader__content');
    expect(loaderContent.exists()).toEqual(true);
    expect(loaderContent.prop('style')).toEqual({ opacity: 0 });
  });

  it('redirects to dashboard after shift created', async () => {
    const form = {
      display: 'form',
      components: [
        {
          id: 'shiftminutes',
          label: 'Shift minutes',
          allowMultipleMasks: false,
          showWordCount: false,
          showCharCount: false,
          tableView: true,
          alwaysEnabled: false,
          type: 'textfield',
          input: true,
          key: 'firstName',
          widget: {
            type: '',
          },
        },
        {
          id: 'shifthours',
          label: 'Shift hours',
          allowMultipleMasks: false,
          showWordCount: false,
          showCharCount: false,
          tableView: true,
          alwaysEnabled: false,
          type: 'textfield',
          input: true,
          key: 'firstName',
          widget: {
            type: '',
          },
        },
        {
          id: 'submitId',
          type: 'button',
          label: 'Submit',
          key: 'submit',
          disableOnInvalid: true,
          theme: 'primary',
          input: true,
          tableView: true,
        },
      ],
    };
    const props = {
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: false,
      submittingActiveShift: true,
      activeShiftSuccess: null,
      history: {
        replace: jest.fn(),
      },
      shiftForm: form,
      appConfig: {
        apiRefUrl: 'apiRefUrl',
        workflowUrl: 'workflow',
        operationalDataUrl: 'operational',
      },
      kc:  {
        token : 'token',
        refreshToken: 'refreshToken',
        tokenParsed: {
          session_state: 'sessionState',
          email: 'email',
          given_name: 'given_name',
          family_name: 'familyName'
        }
      }
    };

    const wrapper = await mount(<ShiftPage
      {...props}
      fetchActiveShift={fetchActiveShift}
      fetchShiftForm={fetchShiftForm}
      fetchStaffDetails={fetchStaffDetails}
      fetchExtendedStaffDetails={fetchExtendedStaffDetails}
    />);

    const emit = jest.fn(args => console.log(`Event ${args}`));

    const submission = {
      data: {
        shiftminutes: 10,
        shifthours: 10,
      },
    };
    wrapper.instance().form.formio = {
      emit,
      submission,
    };
    wrapper.setProps({ activeShiftSuccess: true, submittingActiveShift: false });
    expect(emit).toHaveBeenCalled();
    expect(props.history.replace).toHaveBeenCalled();
  });
});
