import Immutable from 'immutable';
import * as actions from './actionTypes';

const {Map} = Immutable;

const initialState = new Map({
    searching: false,
    businessKeyQuery: null,
    caseSearchResults: null
});

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.FIND_CASES_BY_KEY:
            return state.set('businessKeyQuery', action.key)
                .set('searching', true);
        case actions.FIND_CASES_BY_KEY_SUCCESS:
            return state.set('searching', false)
                .set('caseSearchResults', action.payload.entity);
        case actions.RESET:
            return initialState;
        default:
            return state;
    }
}


export default reducer;
