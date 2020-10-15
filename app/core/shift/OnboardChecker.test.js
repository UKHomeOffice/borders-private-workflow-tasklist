import moment from 'moment';
import OnboardChecker from './OnboardChecker';

describe('OnboardChecker', () => {
  it('onboard-user for new user', () => {
    const staffDetails = null;

    const response = OnboardChecker.onBoardCheck(staffDetails);
    expect(response.redirectPath).toEqual('/onboard-user');
  });

  it('noops-dashboard for inflight onboarding process', () => {
    const staffDetails = {
      onboardprocessinstanceid: 'id',
    };
    const response = OnboardChecker.onBoardCheck(staffDetails);
    expect(response.redirectPath).toEqual('/noop-dashboard');
  });

  it('authorized redirectPath if staff contains dateofleaving', () => {
    const staffDetails = {
      dateofleaving: '01/01/2018',
    };
    const response = OnboardChecker.onBoardCheck(staffDetails);
    expect(response.redirectPath).toEqual('/unauthorized');
  });


  it('all checks passed', () => {
    const staffDetails = {
      mandeclastupdate: moment().add(2, 'year'),
      staffid: 'staffid',
      onboardprocessinstanceid: null,
    };
    const response = OnboardChecker.onBoardCheck(staffDetails);
    expect(response.redirectPath).toEqual(null);
  });
});
