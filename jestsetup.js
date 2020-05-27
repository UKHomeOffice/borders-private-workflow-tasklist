import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

global.MutationObserver = class {
  constructor(callback) {}
  disconnect = jest.fn();
  observe = jest.fn((target, options) => {});
};

global.crypto = {
  getRandomValues: jest.fn(),
};
