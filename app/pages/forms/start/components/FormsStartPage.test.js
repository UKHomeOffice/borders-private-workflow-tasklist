import React from 'react';
import Immutable from 'immutable';
import { FormsStartPage } from './FormsStartPage';
import secureLocalStorage from '../../../../common/security/SecureLocalStorage';

jest.mock('../../../../common/security/SecureLocalStorage', () => ({
  get: jest.fn(),
  set: jest.fn(),
  removeAll: jest.fn(),
  remove: jest.fn(),
}));

const form = {
  display: 'form',
  components: [
    {
      id: 'firstNameId',
      label: 'First name',
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
      id: 'surnameId',
      label: 'Surname',
      allowMultipleMasks: false,
      showWordCount: false,
      showCharCount: false,
      tableView: true,
      alwaysEnabled: false,
      type: 'textfield',
      input: true,
      key: 'surname',
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

describe('Submit a form page', () => {
  it('renders loading bar if form is loading', async () => {
    const props = {
      loadingForm: true,
      submissionStatus: null,
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );

    expect(fetchProcessDefinition).toHaveBeenCalled();
    expect(wrapper.find('#dataSpinner').exists()).toEqual(true);
    expect(wrapper.find('.loader-message').text()).toEqual('Loading form...');
  });

  it('displays resource not found if form is missing', async () => {
    const props = {
      loadingForm: false,
      submissionStatus: null,
      form: null,
      processDefinition: Immutable.fromJS({
        formKey: 'formKey',
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );
    expect(fetchProcessDefinition).toHaveBeenCalled();

    expect(wrapper.find('div').text()).toEqual(
      'Form with identifier formKey was not found',
    );
  });

  it('fetches form after loading process definition', async () => {
    const props = {
      loadingForm: true,
      submissionStatus: null,
      isFetchingProcessDefinition: true,
      history: {
        location: {
          pathname: '/path',
        },
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      form: null,
      processDefinition: Immutable.fromJS({
        formKey: 'formKey',
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const fetchProcessDefinition = jest.fn();
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchForm = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchForm,
          fetchProcessDefinition,
        }}
      />,
    );
    expect(fetchProcessDefinition).toHaveBeenCalled();
    wrapper.setProps({
      isFetchingProcessDefinition: false,
    });
    expect(fetchForm).toHaveBeenCalled();
  });

  it('renders the form and process definition', async () => {
    const props = {
      history: {
        location: {
          pathname: '/path',
        },
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      loadingForm: false,
      submissionStatus: null,
      form,
      processDefinition: Immutable.fromJS({
        formKey: 'formKey',
        'process-definition': {
          name: 'procedure',
        },
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await shallow(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );
    expect(fetchProcessDefinition).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders withAuthCheck HOC when passed ManDec path', async () => {
    const props = {
      history: {
        location: {
          pathname: '/path',
        },
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      loadingForm: false,
      submissionStatus: null,
      form,
      processDefinition: Immutable.fromJS({
        formKey: 'formKey',
        'process-definition': {
          name: 'procedure',
        },
      }),
      match: {
        params: {
          processKey: 'mandatory-declaration-report',
        },
        url:
          'http://www.lodev.xyz:8080/view-mandatory-declaration/mandatory-declaration-report-test/1234',
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await shallow(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );
    expect(wrapper.find('AuthCheck')).toHaveLength(1);
  });

  it('renders Loader if submitted form', async () => {
    const props = {
      history: {
        location: {
          pathname: '/path',
        },
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      loadingForm: false,
      submissionStatus: 'SUBMITTING',
      form,
      processDefinition: Immutable.fromJS({
        'process-definition': {
          formKey: 'formKey',
          id: 'id',
        },
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );
    wrapper.setProps({ submittingToWorkflow: true });

    const loaderContent = wrapper.find('.Loader__content');

    expect(secureLocalStorage.get).toHaveBeenCalled();

    expect(loaderContent.exists()).toEqual(true);
    expect(loaderContent.prop('style')).toEqual({ opacity: 0 });
  });

  it('redirects to tasks after submission', async () => {
    const props = {
      history: {
        replace: jest.fn(),
        location: {
          pathname: '/path',
        },
      },
      submissionResponse: {},
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
      loadingForm: false,
      submissionStatus: 'SUBMITTING',
      form,
      log: jest.fn(),
      processDefinition: Immutable.fromJS({
        'process-definition': {
          formKey: 'formKey',
          id: 'id',
        },
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );

    const emit = jest.fn(args => console.log(`Event ${args}`));
    wrapper.instance().form.formio = {
      emit,
    };
    wrapper.setProps({ submissionStatus: 'SUBMISSION_SUCCESSFUL' });

    expect(emit).toHaveBeenCalled();
    expect(secureLocalStorage.remove).toHaveBeenCalled();
    expect(props.history.replace).toHaveBeenCalled();
  });

  it('does not redirect if there was an error', async () => {
    const props = {
      loadingForm: false,
      submissionStatus: 'SUBMITTING',
      submissionResponse: {},
      form,
      log: jest.fn(),
      processDefinition: Immutable.fromJS({
        'process-definition': {
          formKey: 'formKey',
          id: 'id',
        },
      }),
      match: {
        params: {
          processKey: 'processKey',
        },
      },
      history: {
        replace: jest.fn(),
        location: {
          pathname: '/path',
        },
      },
      kc: {
        tokenParsed: {
          email: 'email',
        },
      },
    };
    const clearProcessDefinition = jest.fn();
    const fetchExtendedStaffDetails = jest.fn();
    const fetchProcessDefinition = jest.fn();

    const wrapper = await mount(
      <FormsStartPage
        {...props}
        {...{
          clearProcessDefinition,
          fetchExtendedStaffDetails,
          fetchProcessDefinition,
        }}
      />,
    );

    const emit = jest.fn(args => console.log(`Event ${args}`));
    const submission = {
      data: {
        firstNameId: 'firstname',
        surnameId: 'surname',
      },
    };
    wrapper.instance().form.formio = {
      emit,
      submission,
    };
    wrapper.setProps({ submissionStatus: 'FAILED' });

    expect(emit).toBeCalledWith('error');
    expect(emit).toBeCalledWith('change', submission);
    expect(props.log).toHaveBeenCalled();
    expect(props.history.replace).not.toHaveBeenCalled();
  });
});
