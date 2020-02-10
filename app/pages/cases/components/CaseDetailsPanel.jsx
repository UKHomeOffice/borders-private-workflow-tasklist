import React from 'react';
import {Accordion} from 'govuk-frontend'
import moment from 'moment'
import FormDetailsPanel from "./FormDetailsPanel";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {getFormVersion, setSelectedVersionId} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {selectedVersionId} from "../selectors";
import withLog from "../../../core/error/component/withLog";
import GovUKDetailsObserver from "../../../core/util/GovUKDetailsObserver";


class CaseDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.observer = new GovUKDetailsObserver(document.getElementById("caseDetails")).create();
        new Accordion(document.getElementById("caseDetails")).init();
    }

    componentWillUnmount() {
        this.observer.destroy();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        const {caseDetails} = this.props;

        return <div id="caseDetails" className="govuk-accordion" data-module="govuk-accordion">
            {caseDetails.processInstances.map(processInstance => {
                if (!processInstance.formReferences || processInstance.formReferences.length === 0) {
                    return <div key={processInstance.id}/>
                }
                return <div className="govuk-accordion__section" key={processInstance.id}>
                    <div className="govuk-accordion__section-header">
                        <h4 className="govuk-accordion__section-heading">
                            <span className="govuk-accordion__section-button" id={`heading-${processInstance.id}`}>
                                {processInstance.name} </span>
                        </h4>
                    </div>
                    <div id={`accordion-with-summary-sections-content-${processInstance.id}`}
                         className="govuk-accordion__section-content"
                         aria-labelledby={`accordion-with-summary-sections-heading-${processInstance.id}`}>
                        <h4 className="govuk-heading-s">Forms completed</h4>
                        <table className="govuk-table">
                            <caption className="govuk-table__caption">Status: <span
                                className="govuk-tag">{processInstance.endDate ? 'Completed' : 'Active'}</span>
                            </caption>
                            <thead className="govuk-table__head">
                            <tr className="govuk-table__row">
                                <th scope="col" className="govuk-table__header">Title</th>
                                <th scope="col" className="govuk-table__header">Submitted by</th>
                                <th scope="col" className="govuk-table__header">Submitted on</th>
                            </tr>
                            </thead>
                            <tbody className="govuk-table__body">
                            {processInstance.formReferences.map(formReference => {
                                const formVersionId = formReference.versionId;
                                return <tr key={formReference.name} className="govuk-table__row">
                                    <th scope="row" className="govuk-table__header">
                                        <details
                                            className="govuk-details" data-module="govuk-details"
                                            onClick={(event) => {
                                                const isOpen = event.currentTarget.getAttribute("open");
                                                if (!isOpen && (this.props.selectedVersionId !== formVersionId)) {
                                                    this.props.setSelectedVersionId(formVersionId);
                                                    const details = document.getElementsByTagName("details");
                                                    details.forEach(detail => {
                                                        if (detail !== event.currentTarget) {
                                                            detail.removeAttribute("open");
                                                        }
                                                    });
                                                }
                                            }}>
                                            <summary className="govuk-details__summary">
                                            <span className="govuk-details__summary-text">
                                              {formReference.title}
                                            </span>
                                            </summary>
                                            <div>
                                                {(this.props.selectedVersionId
                                                    && this.props.selectedVersionId === formVersionId) ?
                                                    <FormDetailsPanel
                                                        key={formVersionId}
                                                        {...{formVersionId: this.props.selectedVersionId}} /> : null}
                                            </div>
                                        </details>
                                    </th>
                                    <td className="govuk-table__cell">{formReference.submittedBy}</td>
                                    <td className="govuk-table__cell">{moment(formReference.submissionDate).format('DD/MM/YYYY HH:mm')}</td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            })}
        </div>
    }
}

CaseDetailsPanel.propTypes = {
    setSelectedVersionId: PropTypes.func.isRequired,
    selectedVersionId: PropTypes.string
};

const mapDispatchToProps = dispatch => bindActionCreators({getFormVersion, setSelectedVersionId}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        selectedVersionId: selectedVersionId(state),
    }
}, mapDispatchToProps)(withLog(CaseDetailsPanel)));

