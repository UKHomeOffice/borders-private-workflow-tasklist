import React from 'react';
import PropTypes from "prop-types";
import moment from 'moment';

export default class CaseMetrics extends React.Component {


    render() {
        const {caseDetails} = this.props;
        const {metrics} = caseDetails;
        return (
          <div className="govuk-grid-row govuk-card" id="caseMetrics">
            <div className="govuk-grid-column-full">
              <h3 className="govuk-heading-m">Case metrics</h3>
              <details className="govuk-details" data-module="govuk-details">
                <summary className="govuk-details__summary">
                  <span className="govuk-details__summary-text">
                           Basic metrics related to {caseDetails.businessKey}
                  </span>
                </summary>
                <div className="govuk-grid-row govuk-!-margin-top-4">
                  <div className="govuk-grid-column-full">
                    <div className="govuk-grid-row">
                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body ">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {metrics.noOfRunningProcessInstances}
                            </span>
                            <span className="govuk-!-font-size-19">
                                                Open processes
                            </span>
                          </div>

                        </div>
                      </div>
                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {metrics.noOfCompletedProcessInstances}
                            </span>
                            <span className="govuk-!-font-size-19">
                                                Completed processes
                            </span>
                          </div>

                        </div>
                      </div>
                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body ">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {metrics.noOfCompletedUserTasks}
                            </span> <span className="govuk-!-font-size-19">Completed tasks</span>
                          </div>
                        </div>
                      </div>
                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body ">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {metrics.noOfOpenUserTasks}
                            </span>
                            <span className="govuk-!-font-size-19">Open tasks</span>
                          </div>
                        </div>
                      </div>

                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body ">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {moment.duration(metrics.overallTimeInSeconds, 'seconds').humanize()}
                            </span>
                            <span className="govuk-!-font-size-19">Total time</span>
                          </div>
                        </div>
                      </div>
                      <div className="govuk-grid-column-one-third">
                        <div className="metrics-card">
                          <div className="metrics-card-body ">
                            <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                              {moment.duration(metrics.averageTimeToCompleteProcessInSeconds, 'seconds').humanize()}
                            </span>
                            <span className="govuk-!-font-size-19">Average process completion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
)
    }
}

CaseMetrics.propTypes = {
    caseDetails: PropTypes.shape({
        businessKey: PropTypes.string,
        metrics: PropTypes.shape({
            noOfRunningProcessInstances: PropTypes.number,
            noOfCompletedProcessInstances: PropTypes.number,
            overallTimeInSeconds: PropTypes.number,
            noOfCompletedUserTasks: PropTypes.number,
            noOfOpenUserTasks: PropTypes.number,
            averageTimeToCompleteProcessInSeconds: PropTypes.number
        })
    })
};
