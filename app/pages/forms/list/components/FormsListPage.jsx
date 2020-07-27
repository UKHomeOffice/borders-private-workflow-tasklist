import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import {
  isFetchingProcessDefinitions,
  processDefinitions,
} from '../selectors';
import AppConstants from '../../../../common/AppConstants';

export class FormsListPage extends React.Component {
  componentDidMount() {
    this.props.fetchProcessDefinitions();
    this.process = this.process.bind(this);
    this.viewProcessDiagram = this.viewProcessDiagram.bind(this);
  }

  process = process => {
    this.props.history.replace(
      `${AppConstants.SUBMIT_A_FORM}/${process.getIn([
        'process-definition',
        'key',
      ])}`,
    );
  };

  viewProcessDiagram = process => {
    this.props.history.replace(
      `/procedure-diagram/${  process.getIn(['process-definition', 'key'])}`,
    );
  };

  render() {
    const { isFetchingProcessDefinitions, processDefinitions } = this.props;
    return (
      <React.Fragment>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-xl">Forms</h1>
          </div>
        </div>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <h3 className="govuk-heading-m">Filter list</h3>
          </div>
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-l">Operational forms</h2>
            <p className="govuk-body-l">Here are all the forms available on COP for completing a variety of tasks from reporting events to requesting building passes.</p>
            {isFetchingProcessDefinitions && (
            <h4 className="govuk-heading-s" id="loading">
                  Loading forms...
            </h4>
              )}
            <ul
              id="formList"
              className="app-task-list"
            >
              {processDefinitions.map(p => {
                  const processDefinitionKey = p.getIn([
                    'process-definition',
                    'key',
                  ]);
                  const description = p.getIn([
                    'process-definition',
                    'description',
                  ]);
                  return (
                    <li className="app-task-list__item" key={processDefinitionKey}>
                      <span className="app-task-list__task-name">
                        <a
                          id="actionButton"
                          className="govuk-link govuk-link--no-visited-state govuk-body"
                          onClick={() => this.process(p)}
                          onKeyPress={this.handleKeyPress}
                          href=""
                        >
                          {description}
                        </a>
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FormsListPage.propTypes = {
  fetchProcessDefinitions: PropTypes.func.isRequired,
  processDefinitions: ImmutablePropTypes.list.isRequired,
  isFetchingProcessDefinitions: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  processDefinitions,
  isFetchingProcessDefinitions,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(FormsListPage));
