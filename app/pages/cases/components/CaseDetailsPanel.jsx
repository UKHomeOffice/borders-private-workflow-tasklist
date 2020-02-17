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
import _ from 'lodash';

class CaseDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.groupForms = this.groupForms.bind(this);
    }

    componentDidMount() {
        const {caseDetails} = this.props;
        this.observer = new GovUKDetailsObserver(document.getElementById(`caseDetails-${caseDetails.businessKey}`)).create();
        new Accordion(document.getElementById(`caseDetails-${caseDetails.businessKey}`)).init();
    }

    componentWillUnmount() {
        this.observer.destroy();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    groupForms = (formReferences) => {
        return _.mapValues(_.groupBy(formReferences, "title"), v => _.orderBy(v, (d) => {
            return moment(d.submissionDate)
        }, ['desc']));
    };

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
                    <div id={`caseDetails-${caseDetails.businessKey}`} className="govuk-accordion"
                         data-module="govuk-accordion">
                        {caseDetails.processInstances.map(processInstance => {
                            const groupedForms = this.groupForms(processInstance.formReferences);
                            return <div className="govuk-accordion__section" key={processInstance.id}>
                                <div className="govuk-accordion__section-header">
                                    <h4 className="govuk-accordion__section-heading">
                                         <span className="govuk-accordion__section-button"
                                               id={`heading-${processInstance.id}`}>
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
                                    <h3 className="govuk-heading-m">{Object.keys(groupedForms).length} completed</h3>
                                    <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>
                                    {processInstance.formReferences && processInstance.formReferences.length !== 0 ? <div>
                                        {Object.keys(groupedForms).map((formName, index) => {
                                            const forms = groupedForms[formName];
                                            return <React.Fragment key={formName}>
                                                <details id={formName} className="govuk-details"
                                                         data-module="govuk-details">
                                                    <summary className="govuk-details__summary">
                                                        <span className="govuk-details__summary-text">
                                                            {formName}
                                                        </span>
                                                    </summary>
                                                    <div>
                                                        {forms.map((form, index) => {
                                                            const formVersionId = form.versionId;
                                                            const key = `${formVersionId}-${form.submissionDate}`;
                                                            return <dl key={key}
                                                                       className="govuk-summary-list govuk-summary-list--no-border">
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

                                                                <div className="govuk-summary-list__row">
                                                                    <dt className="govuk-summary-list__key">
                                                                        {index === 0 ? <span
                                                                            className="govuk-tag">Latest</span> : null}
                                                                    </dt>
                                                                    <dd className="govuk-summary-list__value">
                                                                        <details id="formDetails"
                                                                                 className="govuk-details"
                                                                                 onClick={(event) => {
                                                                                     const isOpen = event.currentTarget.getAttribute("open");
                                                                                     const keyFromSelectedReference = selectedFormReference ?
                                                                                         `${selectedFormReference.versionId}-${selectedFormReference.submissionDate}` : null;
                                                                                     if (!isOpen && (!selectedFormReference || (keyFromSelectedReference && keyFromSelectedReference !== key))) {
                                                                                         this.props.setSelectedFormReference(form);
                                                                                         const details = document.getElementsByTagName("details");
                                                                                         details.forEach(detail => {
                                                                                             if (detail.id === 'formDetails' && detail !== event.currentTarget) {
                                                                                                 detail.removeAttribute("open");
                                                                                             }
                                                                                         });
                                                                                     }
                                                                                 }}
                                                                                 data-module="govuk-details">
                                                                            <summary className="govuk-details__summary">
                                                                                <span
                                                                                    className="govuk-details__summary-text">
                                                                                  View details
                                                                                </span>
                                                                            </summary>
                                                                            <div>
                                                                                {(selectedFormReference
                                                                                    &&
                                                                                    `${selectedFormReference.versionId}-${selectedFormReference.submissionDate}`
                                                                                    === key) ?
                                                                                    <FormDetailsPanel
                                                                                        key={key}
                                                                                        {...{
                                                                                            formReference: this.props.selectedFormReference,
                                                                                            businessKey: caseDetails.businessKey
                                                                                        }} /> : null}
                                                                            </div>
                                                                        </details>
                                                                    </dd>
                                                                </div>

                                                            </dl>
                                                        })}
                                                    </div>
                                                </details>
                                                {(Object.keys(groupedForms).length - 1) !== index ?
                                                    <hr style={{
                                                        borderBottom: '2px solid #1d70b8',
                                                        borderTop: 'none'
                                                    }}/> : null}
                                            </React.Fragment>
                                        })}
                                    </div> : <h4 className="govuk-heading-s">No forms available</h4>}
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

