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
import './FormsListPage.css';
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
        <div className="govuk-grid-row" id="proceduresCountLabel">
          <div className="govuk-grid-column-one-half">
            <span className="govuk-caption-l">Operational forms</span>
            <h2 className="govuk-heading-l">
              {processDefinitions.size} forms
            </h2>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            {isFetchingProcessDefinitions ? (
              <h4 className="govuk-heading-s" id="loading">
                Loading forms...
              </h4>
            ) : (
              processDefinitions.map(p => {
                const processDefinitionKey = p.getIn([
                  'process-definition',
                  'key',
                ]);
                const description = p.getIn([
                  'process-definition',
                  'description',
                ]);
                return (
                  <div
                    id="form"
                    className="govuk-grid-row"
                    key={processDefinitionKey}
                  >
                    <div className="govuk-grid-column-full govuk-card">
                      <p
                        id="formDescription"
                        className="govuk-body govuk-body govuk-!-font-size-19"
                      >
                        {description}
                      </p>
                      <div
                        className="govuk-grid-row"
                        key={processDefinitionKey}
                      >
                        <div className="govuk-grid-column-one-third">
                          <button
                            id="actionButton"
                            className="govuk-button govuk-button--start"
                            onClick={() => this.process(p)}
                            type="submit"
                          >
                            Start
                            <svg
                              className="govuk-button__start-icon"
                              xmlns="http://www.w3.org/2000/svg"
                              width="17.5"
                              height="19"
                              viewBox="0 0 33 40"
                              role="presentation"
                              focusable="false"
                            >
                              <path
                                fill="currentColor"
                                d="M0 0h13l20 20-20 20H0l20-20z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
