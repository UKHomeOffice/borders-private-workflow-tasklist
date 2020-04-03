import React from 'react';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {Accordion} from 'govuk-frontend';
import CaseAction from "./CaseAction";
import withLog from "../../../../core/error/component/withLog";
import {setSelectedAction} from "../actions";
import {selectedAction} from "../selectors";

class CaseActions extends React.Component {

    componentDidMount() {
        const {caseDetails} = this.props;
        new Accordion(document.getElementById(`caseDetails-${caseDetails.businessKey}-actions`)).init();
        if (caseDetails.actions && caseDetails.actions.length !== 0) {
            this.props.setSelectedAction(caseDetails.actions[0]);
        }
    }

    render() {
        const {caseDetails, selectedAction, setSelectedAction} = this.props;

        return (
          <div className="govuk-grid-row govuk-card" id="caseActions">
            <div className="govuk-grid-column-full">
              <div
                id={`caseDetails-${caseDetails.businessKey}-actions`}
                className="govuk-accordion"
                data-module="govuk-accordion"
              >
                <div className="govuk-accordion__section">
                  <div className="govuk-accordion__section-header">
                    <h4 className="govuk-accordion__section-heading">
                      <span
                        className="govuk-accordion__section-button"
                        id={`heading-${caseDetails.businessKey}-actions`}
                      >Case actions
                      </span>
                    </h4>
                  </div>
                  <div
                    id={`accordion-with-summary-sections-content-${caseDetails.businessKey}-actions`}
                    className="govuk-accordion__section-content"
                    aria-labelledby={`accordion-with-summary-sections-heading-${caseDetails.businessKey}-actions`}
                  >
                    {caseDetails.actions.length !== 0 ? (
                      <div className="govuk-tabs" data-module="govuk-tabs">
                        <ul className="govuk-tabs__list">
                          {caseDetails.actions.map(action => {
                                            const {key} = action.process['process-definition'];
                                            const isSelected = selectedAction &&
                                                selectedAction.process['process-definition'].key === key;
                                            return (
                                              <li
                                                key={key}
                                                className={`govuk-tabs__list-item ${isSelected ? ' govuk-tabs__list-item--selected' : ''}`}
                                              >
                                                <a
                                                  className="govuk-tabs__tab"
                                                  href={`#${key}`}
                                                  onClick={event => {
                                                    event.preventDefault();
                                                    setSelectedAction(action);
                                                }}
                                                > {action.process['process-definition'].name}
                                                </a>
                                              </li>
)
                                        })}
                        </ul>

                        {selectedAction ? (
                          <section
                            className="govuk-tabs__panel"
                            id={selectedAction.process['process-definition'].key}
                          >
                            <CaseAction {...{selectedAction, caseDetails}} />

                          </section>
) : null }
                      </div>
                              )
                                : <h4 className="govuk-heading-s">No actions available</h4>}
                  </div>
                </div>
              </div>
            </div>
          </div>
);
    }
}

CaseActions.propTypes = {
    setSelectedAction: PropTypes.func,
    selectedAction: PropTypes.object,
    caseDetails: PropTypes.shape({
        businessKey: PropTypes.string,
        actions: PropTypes.arrayOf(PropTypes.shape({
            process: PropTypes.shape({
                formKey: PropTypes.string,
                'process-definition': PropTypes.shape({
                    id: PropTypes.string,
                    key: PropTypes.string,
                    name: PropTypes.string
                })
            })
        }))
    })
};
const mapDispatchToProps = dispatch => bindActionCreators({setSelectedAction}, dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        selectedAction: selectedAction(state),
    }
}, mapDispatchToProps)(withLog(CaseActions)));

