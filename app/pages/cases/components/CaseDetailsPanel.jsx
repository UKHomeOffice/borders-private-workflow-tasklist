import React from 'react';
import {Accordion} from 'govuk-frontend'
import moment from 'moment'
import FormDetailsPanel from "./FormDetailsPanel";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {getFormVersion, setSelectedFormReference} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {selectedFormReference} from "../selectors";
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
        const {caseDetails, selectedFormReference} = this.props;

        return <React.Fragment>
            <div className="govuk-row">
                <div className="govuk-grid-column-full govuk-card">
                    <h3 className="govuk-heading-m">{caseDetails.businessKey}</h3>
                </div>
            </div>
            <div className="govuk-row">
                <div className="govuk-grid-column-full">
                    <div id="caseDetails" className="govuk-accordion" data-module="govuk-accordion">
                        {caseDetails.processInstances.map(processInstance => {
                            if (!processInstance.formReferences || processInstance.formReferences.length === 0) {
                                return <div key={processInstance.id}/>
                            }
                            return <div className="govuk-accordion__section" key={processInstance.id}>
                                <div className="govuk-accordion__section-header">
                                    <h4 className="govuk-accordion__section-heading">
                            <span className="govuk-accordion__section-button" id={`heading-${processInstance.id}`}>
                                {processInstance.name}</span>
                                    </h4>
                                </div>
                                <div id={`accordion-with-summary-sections-content-${processInstance.id}`}
                                     className="govuk-accordion__section-content"
                                     aria-labelledby={`accordion-with-summary-sections-heading-${processInstance.id}`}>
                                    <span className="govuk-caption-m">Status</span>
                                    <h3 className="govuk-heading-m"><span
                                        className="govuk-tag">{processInstance.endDate ? 'Completed' : 'Active'}</span>
                                    </h3>
                                    <span className="govuk-caption-m">Forms</span>
                                    <h3 className="govuk-heading-m">{processInstance.formReferences.length} completed</h3>
                                    <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"/>
                                    <div>
                                        {processInstance.formReferences.map((form, index) => {
                                            const formVersionId = form.versionId;
                                            return <React.Fragment key={form.name}>
                                                <dl className="govuk-summary-list  govuk-summary-list--no-border">
                                                    <div className="govuk-summary-list__row">
                                                        <dt className="govuk-summary-list__key">
                                                            Form name
                                                        </dt>
                                                        <dd className="govuk-summary-list__value">
                                                            <details
                                                                className="govuk-details" data-module="govuk-details"
                                                                onClick={(event) => {
                                                                    const isOpen = event.currentTarget.getAttribute("open");
                                                                    if (!isOpen && (!selectedFormReference || selectedFormReference.versionId !== formVersionId)) {
                                                                        this.props.setSelectedFormReference(form);
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
                                                    {form.title}
                                                        </span>
                                                                </summary>
                                                                <div>
                                                                    {(selectedFormReference
                                                                        && selectedFormReference.versionId === formVersionId) ?
                                                                        <FormDetailsPanel
                                                                            key={formVersionId}
                                                                            {...{
                                                                                formReference: this.props.selectedFormReference,
                                                                                businessKey: caseDetails.businessKey
                                                                            }} /> : null}
                                                                </div>
                                                            </details>
                                                        </dd>
                                                    </div>
                                                    <div className="govuk-summary-list__row">
                                                        <dt className="govuk-summary-list__key">
                                                            Submitted by
                                                        </dt>
                                                        <dd className="govuk-summary-list__value">
                                                            {form.submittedBy}
                                                        </dd>
                                                    </div>
                                                    <div className="govuk-summary-list__row">
                                                        <dt className="govuk-summary-list__key">
                                                            Submitted on
                                                        </dt>
                                                        <dd className="govuk-summary-list__value">
                                                            {moment(form.submissionDate).format('DD/MM/YYYY HH:mm')}
                                                        </dd>
                                                    </div>
                                                </dl>
                                                {(processInstance.formReferences.length - 1) !== index ?
                                                    <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"/> : null}
                                            </React.Fragment>
                                        })}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

CaseDetailsPanel.propTypes = {
    setSelectedFormReference: PropTypes.func.isRequired,
    selectedFormReference: PropTypes.object
};

const mapDispatchToProps = dispatch => bindActionCreators({getFormVersion, setSelectedFormReference}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        selectedFormReference: selectedFormReference(state),
    }
}, mapDispatchToProps)(withLog(CaseDetailsPanel)));

