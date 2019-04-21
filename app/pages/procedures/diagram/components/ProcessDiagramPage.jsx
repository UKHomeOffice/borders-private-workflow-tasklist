import React from 'react';
import PropTypes from 'prop-types';
import ProcessViewer from './ProcessViewer';
import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { isFetchingProcessDefinition, processDefinition } from '../../start/selectors';
import { bindActionCreators } from 'redux';
import * as actions from '../../diagram/actions';
import * as procedureActions from '../../start/actions';

import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { isMobile } from 'react-device-detect';
import { isFetchingProcessDefinitionXml, processDefinitionXml } from '../selectors';

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
      return <div>
        <div className="govuk-back-link" style={{textDecoration: 'none'}} onClick={(event) => this.props.history.replace('/procedures')}>Back to
          procedures
        </div>
        <div className="govuk-heading-m">Process diagram not viewable on mobile screen</div>
      </div>
    }

    return <div>
      <a href="#" id="backToProcedures"  style={{textDecoration: 'none'}} className="govuk-back-link" onClick={(event) => this.props.history.replace('/procedures')}>Back to
        procedures
      </a>
      <div id="startProcedure" style={{ position: 'absolute', right: '2px', width: '200px'}}>
        <button id="actionButton" className="govuk-button app-button--inverse" onClick={(event) => this.props.history.replace('/start-a-procedure/'
          + processDefinition.getIn(['process-definition', 'key']))} type="submit"
        >Start</button>
      </div>
      {isFetchingProcessDefinition && isFetchingProcessDefinitionXml ?  <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20%'}}><Spinner
        name="line-spin-fade-loader" color="black"/></div> : <div>
        <ProcessViewer processDefinition={processDefinition} xml={processDefinitionXml}/>
      </div> }
    </div>

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
  processDefinition: processDefinition,
  isFetchingProcessDefinition: isFetchingProcessDefinition,
  processDefinitionXml: processDefinitionXml,
  isFetchingProcessDefinitionXml: isFetchingProcessDefinitionXml
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign(actions, procedureActions), dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProcessDiagramPage));

