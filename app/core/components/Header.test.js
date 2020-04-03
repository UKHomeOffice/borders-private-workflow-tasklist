import React from 'react';
import { createMemoryHistory } from 'history'
import { Header } from './Header';

describe('Header', () => {

  const props = {
    history: createMemoryHistory(),
    appConfig: {
      serviceDeskUrls: {
        support: 'test'
      }
    },
    kc: {
      logout: jest.fn(),
    },
  }

  it('renders without crashing', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders Profile link', () => {
    const wrapper = shallow(<Header {...props} />);
    const node = wrapper.find('#profile');
    expect(node.text()).toBe('My profile');
    expect(node.prop('href')).toBe('/submit-a-form/edit-your-profile');
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
