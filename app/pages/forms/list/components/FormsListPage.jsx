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
import './FormsListPage.css';
import AppConstants from '../../../../common/AppConstants';

export class FormsListPage extends React.Component {

  componentDidMount() {
    document.title = `Forms | ${AppConstants.APP_NAME}`;
    this.props.fetchProcessDefinitions();
    this.process = this.process.bind(this);
    this.viewProcessDiagram = this.viewProcessDiagram.bind(this);
  }

  process = (process) => {
    this.props.history.replace(`${AppConstants.SUBMIT_A_FORM}/${process.getIn(['process-definition', 'key'])}`);
  };

  viewProcessDiagram = (process) => {
    this.props.history.replace('/procedure-diagram/'+ process.getIn(['process-definition', 'key']));
  };

  render() {
    const { isFetchingProcessDefinitions, processDefinitions } = this.props;
    const data = processDefinitions ? processDefinitions.map((p) => {
      const description = p.getIn(['process-definition', 'description']);
      return {
          key: p.getIn(['process-definition', 'key']),
          name: description,
          description: <p className="process-description govuk-body govuk-!-font-size-19">{p.getIn(['process-definition', 'description'])}</p>,
          action: <button id="actionButton" className="govuk-button" onClick={() => this.process(p)} type="submit">Start</button>,
        }
    }).toArray() : [];

    const headers = !types.isMobile ? {
      description: <div className="govuk-!-font-size-19 govuk-!-font-weight-bold" style={{paddingBottom: '5px'}}>Description</div>,
      action: null,
    } : {
      name: null,
      action: null
    };

    return <div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <span className="govuk-caption-l">Operational forms</span>
          <h2 className="govuk-heading-l" id="proceduresCountLabel">{processDefinitions.size} forms</h2>
        </div>

      </div>
      {isFetchingProcessDefinitions ? <h4 className="govuk-heading-s" id="loading">Loading forms...</h4> :
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

FormsListPage.propTypes = {
  fetchProcessDefinitions: PropTypes.func.isRequired,
  processDefinitions: ImmutablePropTypes.list.isRequired,
  isFetchingProcessDefinitions: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  processDefinitions: processDefinitions,
  isFetchingProcessDefinitions: isFetchingProcessDefinitions
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FormsListPage));
