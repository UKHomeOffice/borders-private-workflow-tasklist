import React from 'react';
import Immutable from 'immutable';
import { ShiftPage } from './ShiftPage';
import { ErrorHandlingComponent } from '../../../core/error/component/ErrorHandlingComponent';
import AppConstants from '../../../common/AppConstants';

describe('Shift page', () => {
  const fetchActiveShift = jest.fn();
  const fetchShiftForm = jest.fn();
  const fetchStaffDetails = jest.fn();
  const fetchExtendedStaffDetails = jest.fn();
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
  const initProps = {
    isFetchingShift: true,
    isFetchingStaffDetails: true,
    isFetchingExtendedStaffDetails: true,
    loadingShiftForm: true,
    failedToCreateShift: false,
    submittingActiveShift: false,
    shiftForm: {},
    history: {
      replace: jest.fn(),
    },
    appConfig: {
      apiRefUrl: 'apiRefUrl',
      workflowUrl: 'workflow',
      operationalDataUrl: 'operational',
    },
    kc: {
      token: 'token',
      refreshToken: 'refreshToken',
      tokenParsed: {
        session_state: 'sessionState',
        email: 'email',
        given_name: 'given_name',
        family_name: 'familyName',
      },
    },
    fetchActiveShift,
    fetchShiftForm,
    fetchStaffDetails,
    fetchExtendedStaffDetails,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets document title as expected if starting shift', () => {
    shallow(<ShiftPage {...initProps} />);
    expect(global.window.document.title).toBe(
      `Start shift | ${AppConstants.APP_NAME}`,
    );
  });

  it('sets document title as expected if editing shift', () => {
    const props = {
      ...initProps,
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: false,
      submittingActiveShift: true,
      activeShiftSuccess: null,
      shift: {},
    };

    shallow(<ShiftPage {...props} />);
    expect(global.window.document.title).toBe(
      `Edit shift | ${AppConstants.APP_NAME}`,
    );
  });

  it('renders loading page for props', async () => {
    const wrapper = await mount(<ShiftPage {...initProps} />);

    expect(fetchStaffDetails).toHaveBeenCalledTimes(1);
    expect(fetchShiftForm).toHaveBeenCalledTimes(1);
    expect(fetchStaffDetails).toHaveBeenCalledTimes(1);
    expect(fetchExtendedStaffDetails).toHaveBeenCalledTimes(1);

    expect(wrapper.find('#dataSpinner').exists()).toEqual(true);
    expect(wrapper.find('.loader-message').text()).toEqual(
      'Loading your shift details',
    );
  });

  it('renders error panel if submission fails', async () => {
    const props = {
      ...initProps,
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: true,
      appConfig: {
        serviceDeskUrls: {
          support: 'http://test.com',
        },
      },
    };
    const wrapper = await mount(
      <ErrorHandlingComponent
        {...props}
        skipAuth
        hasError
        errors={Immutable.fromJS([
          {
            message: 'failed',
          },
        ])}
      >
        <ShiftPage {...props} />
      </ErrorHandlingComponent>,
    );

    expect(fetchStaffDetails).toHaveBeenCalledTimes(1);
    expect(fetchShiftForm).toHaveBeenCalledTimes(1);
    expect(fetchStaffDetails).toHaveBeenCalledTimes(1);
    expect(fetchExtendedStaffDetails).toHaveBeenCalledTimes(1);

    expect(wrapper.find('.govuk-error-summary').exists()).toEqual(true);
  });

  it('renders submitting once submitted', async () => {
    const props = {
      ...initProps,
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      isFetchingExtendedStaffDetails: false,
      loadingShiftForm: false,
    };
    const wrapper = await mount(<ShiftPage {...props} />);

    wrapper.setProps({ submittingActiveShift: true });
    const loaderContent = wrapper.find('.Loader__content');
    expect(loaderContent.exists()).toEqual(true);
    expect(loaderContent.prop('style')).toEqual({ opacity: 0 });
  });

  it('redirects to dashboard after shift created', async () => {
    const props = {
      ...initProps,
      isFetchingShift: false,
      isFetchingStaffDetails: false,
      loadingShiftForm: false,
      failedToCreateShift: false,
      submittingActiveShift: true,
      activeShiftSuccess: null,
      shiftForm: form,
    };

    const wrapper = await mount(<ShiftPage {...props} />);

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
    wrapper.setProps({
      activeShiftSuccess: true,
      submittingActiveShift: false,
    });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(props.history.replace).toHaveBeenCalledTimes(1);
  });
});
