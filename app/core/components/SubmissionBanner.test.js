import React from 'react';
import { mount, shallow } from 'enzyme';
import PubSub from 'pubsub-js';
import SubmissionBanner from './SubmissionBanner';


describe('SubmissionBanner', () => {
  it('component is hidden if no submission', () => {
    const wrapper = shallow(<SubmissionBanner />);
    expect(wrapper.html()).toBeNull();
  });

  it('renders submission if data received', () => {
    const wrapper = shallow(<SubmissionBanner />);
    PubSub.publishSync('submission', {
      submission: true,
      message: 'test',
    });
    expect(wrapper.html())
      .toEqual('<div class="container" id="successfulSubmission" style="padding-top:5px"><div class="govuk-panel govuk-panel--confirmation"><div class="govuk-panel__body govuk-!-font-size-24 govuk-!-font-weight-bold">test</div></div></div>');
  });
});
