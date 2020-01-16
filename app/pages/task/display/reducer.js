import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map, List } = Immutable;

const initialState = new Map({
  isFetchingTask: true,
  isFetchingComments: false,
  isCreatingComment: false,
  comments: new List([]),
  task: new Map({}),
  form: null,
  isFetchingCreateCommentForm: false,
  unclaimSuccessful: false,
  submittingUnclaim: false,
  claimSuccessful: false,
  completeSuccessful: false,
  variables: null,
  candidateGroups: new List([]),

});

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.CLEAR_TASK:
      return initialState;
      // fetch task
    case actions.FETCH_TASK:
      return initialState;
    case actions.FETCH_TASK_SUCCESS:
      const { task } = action.payload.entity;
      const rawVariables = action.payload.entity.variables ? action.payload.entity.variables : {};
      const variables = {};
      Object.keys(rawVariables).forEach(key => {
        if (rawVariables[key].type === 'Json') {
          variables[key] = JSON.parse(rawVariables[key].value);
        } else {
          variables[key] = rawVariables[key].value;
        }
      });
      return state.set('isFetchingTask', false)
        .set('task', Immutable.fromJS(task))
        .set('candidateGroups', action.payload.entity.candidateGroups
          ? Immutable.fromJS(action.payload.entity.candidateGroups) : new List([]))
        .set('variables', variables);
    case actions.FETCH_TASK_FAILURE:
      return state.set('isFetchingTask', false);

      // fetch comments
    case actions.FETCH_COMMENTS:
      return state.set('isFetchingComments', true)
        .set('comments', new List([]));
    case actions.FETCH_COMMENTS_SUCCESS:
      const comments = action.payload.entity;
      return state.set('isFetchingComments', false)
        .set('comments', Immutable.fromJS(comments));
    case actions.FETCH_COMMENTS_FAILURE:
      return state.set('isFetchingComments', false);

      // create comment
    case actions.CREATE_COMMENT:
      return state.set('isCreatingComment', true);
    case actions.CREATE_COMMENT_SUCCESS:
      const comment = action.payload.entity;
      const commentsFromState = state.get('comments');
      return state.set('isCreatingComment', false)
        .set('comments', commentsFromState.insert(0, Immutable.fromJS(comment)));
      // fetch create comment form
    case actions.FETCH_CREATE_COMMENT_FORM:
      return state.set('isFetchingCreateCommentForm', true);
    case actions.FETCH_CREATE_COMMENT_FORM_SUCCESS:
      const data = action.payload.entity;
      return state.set('isFetchingCreateCommentForm', false)
        .set('form', data);
    case actions.FETCH_CREATE_COMMENT_FORM_FAILURE:
      return state.set('isFetchingCreateCommentForm', false);

    case actions.UNCLAIM_TASK:
      return state.set('submittingUnclaim', true)
        .set('unclaimSuccessful', false);
    case actions.UNCLAIM_TASK_SUCCESS:
      return state.set('unclaimSuccessful', true)
        .set('submittingUnclaim', false);

    case actions.UNCLAIM_TASK_FAILURE:
      return state.set('unclaimSuccessful', false)
        .set('submittingUnclaim', false);

    case actions.CLAIM_TASK_SUCCESS:
      return state.set('claimSuccessful', true);
    case actions.CLAIM_TASK_FAILURE:
      return state.set('claimSuccessful', false);

    case actions.COMPLETE_TASK_SUCCESS:
      return state.set('completeSuccessful', true);
    case actions.COMPLETE_TASK_FAILURE:

      return state.set('completeSuccessful', false);
    default:
      return state;
  }
}


export default reducer;
