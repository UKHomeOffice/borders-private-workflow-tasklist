import React from 'react';
import PropTypes from 'prop-types';
import {
  isFetchingProcessDefinitions,
  processDefinitions
} from '../../list/selectors';
import { createStructuredSelector } from 'reselect';
import * as actions from '../../list/actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import ReactHyperResponsiveTable from 'react-hyper-responsive-table';
import * as types  from "react-device-detect";

export class ProceduresPage extends React.Component {

  componentDidMount() {
    this.props.fetchProcessDefinitions();
    this.process = this.process.bind(this);
    this.viewProcessDiagram = this.viewProcessDiagram.bind(this);
  }

  process = (process) => {
    this.props.history.replace('/start-a-procedure/' + process.getIn(['process-definition', 'key']));
  };

  viewProcessDiagram = (process) => {
    this.props.history.replace('/procedure-diagram/'+ process.getIn(['process-definition', 'key']));
  };

  render() {
    const { isFetchingProcessDefinitions, processDefinitions } = this.props;
    const pointerStyle = { cursor: 'pointer', paddingTop: '10px', textDecoration: 'underline' };

    const data = processDefinitions ? processDefinitions.map((p) => {
      const name = p.getIn(['process-definition', 'name']);
      const description = p.getIn(['process-definition', 'description']);
      return {
          key: p.getIn(['process-definition', 'key']),
          name: description,
          description: p.getIn(['process-definition', 'description']),
          action: <input id="actionButton" className="btn btn-primary" onClick={() => this.process(p)} type="submit"
                         value={name}/>,
          diagram:  null
        }
    }).toArray() : [];

    const headers = !types.isMobile ? {
      description: 'Description',
      diagram: null,
      action: null,
    } : {
      name: null,
      action: null
    };

    return <div>
      <div className="grid-row">
        <div className="column-one-half">
          <h2 className="heading-large">
                    <span
                      className="heading-secondary">Operational procedures</span> {processDefinitions.size} procedures
          </h2>
        </div>

      </div>
      {isFetchingProcessDefinitions ? <div id="loading">Loading processes....</div> :
          <ReactHyperResponsiveTable
          headers={headers}
          rows={data}
          keyGetter={row => row.key}
          breakpoint={578}
          tableStyling={({ narrow }) => (narrow ? 'narrowtable-process' : 'widetable-process')}
        />
      }

    </div>;
  }
}

ProceduresPage.propTypes = {
  fetchProcessDefinitions: PropTypes.func.isRequired,
  processDefinitions: ImmutablePropTypes.list.isRequired,
  isFetchingProcessDefinitions: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  processDefinitions: processDefinitions,
  isFetchingProcessDefinitions: isFetchingProcessDefinitions
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProceduresPage));
