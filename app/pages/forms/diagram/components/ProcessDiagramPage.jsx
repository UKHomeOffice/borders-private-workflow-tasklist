import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { isMobile } from 'react-device-detect';
import * as procedureActions from '../../start/actions';
import * as actions from "../actions";
import { isFetchingProcessDefinition, processDefinition } from '../../start/selectors';
import ProcessViewer from './ProcessViewer';
import { isFetchingProcessDefinitionXml, processDefinitionXml } from '../selectors';
import AppConstants from '../../../../common/AppConstants';

class ProcessDiagramPage extends React.Component {

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.fetchProcessDefinition(params.processKey);
    this.props.fetchProcessDefinitionXml(params.processKey);
  }

  componentWillUnmount() {
    this.props.clearProcessDefinitionXml();
    this.props.clearProcessDefinition();
  }

  render() {
    const {isFetchingProcessDefinition, processDefinition, processDefinitionXml, isFetchingProcessDefinitionXml} = this.props;
    if (isMobile) {
      return (
        <div>
          <div className="govuk-back-link" style={{textDecoration: 'none'}} onClick={event => this.props.history.replace('/procedures')}>Back to
          procedures
          </div>
          <div className="govuk-heading-m">Process diagram not viewable on mobile screen</div>
        </div>
)
    }

    return (
      <div>
        <a href="#" id="backToProcedures" style={{textDecoration: 'none'}} className="govuk-back-link govuk-!-font-size-19" onClick={event => this.props.history.replace('/procedures')}>Back to
        procedures
        </a>
        <div id="startProcedure" style={{ position: 'absolute', right: '2px', width: '200px'}}>
          <button
            id="actionButton"
            className="govuk-button app-button--inverse"
            onClick={event => this.props.history.replace(`${AppConstants.SUBMIT_A_FORM  }/${
           processDefinition.getIn(['process-definition', 'key'])}`)}
            type="submit"
          >Start
          </button>
        </div>
        {isFetchingProcessDefinition && isFetchingProcessDefinitionXml ?  (
          <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%'}}><Spinner
            name="line-spin-fade-loader"
            color="black"
          />
          </div>
) : (
  <div>
    <ProcessViewer processDefinition={processDefinition} xml={processDefinitionXml} />
  </div>
) }
      </div>
)

  }
}
ProcessDiagramPage.propTypes = {
  fetchProcessDefinitionXml: PropTypes.func,
  clearProcessDefinitionXml: PropTypes.func,
  fetchProcessDefinition: PropTypes.func,
  clearProcessDefinition: PropTypes.func,
  processDefinitionXml: PropTypes.string,
  isFetchingProcessDefinitionXml: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  processDefinition,
  isFetchingProcessDefinition,
  processDefinitionXml,
  isFetchingProcessDefinitionXml
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(actions, procedureActions), dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProcessDiagramPage));

