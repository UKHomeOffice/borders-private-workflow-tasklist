export default class OnboardChecker {
  static onBoardCheck(staffDetails, location) {
    if (!staffDetails) {
      return {
        redirectPath: '/onboard-user',
        data: {
          submission: true,
          type: 'warning',
          autoDismiss: true,
          message: 'You will need to follow the below onboarding process',
        },
      };
    }
    if (staffDetails.onboardprocessinstanceid) {
      return {
        redirectPath: '/noop-dashboard',
        data: {
          submission: true,
          type: 'warning',
          autoDismiss: false,
          message: 'Creating your system access, please refresh',
        },
      };
    }
    if (staffDetails.dateofleaving) {
      return {
        redirectPath: '/unauthorized',
      };
    }
    if (location === '/onboard-user') {
      return {
        redirectPath: '/dashboard',
        data: {
          submission: true,
          type: 'warning',
          autoDismiss: true,
          message: 'You are already onboarded to the platform',
        },
      };
    }
    return {
      redirectPath: null,
    };
  }
}
