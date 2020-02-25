import Immutable from 'immutable';
import * as actions from './actionTypes';

const {Map} = Immutable;

export const initialState = new Map({
    selectedAction: null,
    loadingActionForm: false,
    actionForm: null,
    executingAction: false,
    actionResponse: null
});

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.SELECT_ACTION:
            return state.set('selectedAction', action.action);
        case actions.GET_ACTION_FORM:
            return state.set('loadingActionForm', true);
        case actions.GET_ACTION_FORM_SUCCESS:
            return state.set('loadingActionForm', false)
                .set('actionForm', action.payload.entity);
        case actions.GET_ACTION_FORM_FAILURE:
            return state.set('loadingActionForm', false);
        case actions.EXECUTE_ACTION:
            return state.set('executingAction', true);
        case actions.EXECUTE_ACTION_SUCCESS:
            return state.set('executingAction', false)
                .set('actionResponse', action.payload.entity);
        case actions.EXECUTE_ACTION_FAILURE:
            return state.set('executingAction', false);
        case actions.CLEAR_ACTION_RESPONSE:
            return state.set('actionResponse', null);
        case actions.RESET_SELECTED_ACTION:
            return initialState;
        default:
            return state;
    }
}


export default reducer;
