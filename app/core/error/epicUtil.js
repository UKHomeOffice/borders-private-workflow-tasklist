import { Observable } from 'rxjs/Observable';
import * as actions from './actions';


const errorObservable = (failureAction, error) => {
  if (error.status.code === 403) {
    return Observable.concat(Observable.of(actions.handleUnauthorised(error)),
      Observable.of(failureAction), Observable.of(actions.handleError(error)));
  }
  return Observable.concat(Observable.of(failureAction),
    Observable.of(actions.handleError(error)));
};

export {
  errorObservable,
};
