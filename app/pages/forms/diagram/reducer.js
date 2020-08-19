import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map } = Immutable;

const initialState = new Map({
  isFetchingProcessDefinitionXml: false,
  processDefinitionXml: null,
});

function reducer(state = initialState, action) {
  let xml;
  switch (action.type) {
    case actions.FETCH_PROCESS_DEFINITION_XML:
      return state.set('isFetchingProcessDefinitionXml', true);
    case actions.FETCH_PROCESS_DEFINITION_XML_SUCCESS:
      xml =
        action.payload && action.payload.entity
          ? action.payload.entity.bpmn20Xml
          : null;
      return state
        .set('isFetchingProcessDefinitionXml', false)
        .set('processDefinitionXml', xml);
    case actions.RESET_PROCEDURE_XML:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
