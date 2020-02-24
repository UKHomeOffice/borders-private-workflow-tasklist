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
import CaseActions from "../case-actions/components/CaseActions";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CaseMetrics from "./CaseMetrics";

class CaseDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.groupForms = this.groupForms.bind(this);
        this.state = {
            caseReferenceUrl: `${window.location.origin}/cases/${this.props.caseDetails.businessKey}`,
            caseReferenceUrlCopied: false
        }
    }

    componentDidMount() {
        this.observer = new GovUKDetailsObserver(document.getElementById(`case`)).create(true);
        new Accordion(document.querySelector("[data-module='govuk-accordion']")).init();
        this.clearAccordionStorage();
    }

    clearAccordionStorage() {
        _.forIn(window.sessionStorage, (value, key) => {
            if (true === _.startsWith(key, 'caseDetails-')) {
                window.sessionStorage.removeItem(key);
            }
        });
    }

    componentWillUnmount() {
        this.observer.destroy();
        this.clearAccordionStorage()
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

        return <div id="case">
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full govuk-card">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half">
                            <h3 className="govuk-heading-m">{caseDetails.businessKey}</h3>
                        </div>
                        <div className="govuk-grid-column-one-half">
                            <CopyToClipboard text={this.state.caseReferenceUrl}
                                             onCopy={() => this.setState({caseReferenceUrlCopied: true})}>
                                <button style={{float: 'right'}} className="govuk-button govuk-button--secondary">
                                    { this.state.caseReferenceUrlCopied ? 'Copied case link' : 'Copy case link'}
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            </div>
            {caseDetails.actions && caseDetails.actions.length > 0 ? <CaseActions {...{caseDetails}} /> : null}
            {caseDetails.metrics ? <CaseMetrics {...{caseDetails}} /> : null}
            <div className="govuk-grid-row govuk-card mt-4">
                <div className="govuk-grid-column-full">
                    <h3 className="govuk-heading-m">Case history</h3>
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

                                    <div className="govuk-grid-row mb-2">
                                        <div className="govuk-grid-column-full">
                                            <div className="govuk-grid-row">
                                                <div className="govuk-grid-column-one-half">
                                                    <span className="govuk-caption-m">Status</span>
                                                    <h3 className="govuk-heading-m"><span
                                                        className="govuk-tag">{processInstance.endDate ? 'Completed' : 'Active'}</span>
                                                    </h3>
                                                </div>
                                                <div className="govuk-grid-column-one-half">
                                                    <span className="govuk-caption-m">Forms</span>
                                                    <h3 className="govuk-heading-m">{Object.keys(groupedForms).length} completed</h3>

                                                </div>
                                                <div className="govuk-grid-column-one-half">
                                                    <span className="govuk-caption-m">Start date</span>
                                                    <h3 className="govuk-heading-m">{moment(processInstance.startDate).format('DD/MM/YYYY HH:mm')}</h3>
                                                </div>
                                                <div className="govuk-grid-column-one-half">
                                                    <span className="govuk-caption-m">End date</span>

                                                    <h3 className="govuk-heading-m">
                                                        {processInstance.endDate ? moment(processInstance.endDate).format('DD/MM/YYYY HH:mm') :
                                                            'Active'}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {processInstance.formReferences && processInstance.formReferences.length !== 0 ?
                                        <React.Fragment>
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
                                                                const selectedVersionAndKey = selectedFormReference &&
                                                                    `${selectedFormReference.versionId}-${selectedFormReference.submissionDate}` === key;
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
                                                                            <a href="#" onClick={event => {
                                                                                event.preventDefault();
                                                                                const keyFromSelectedReference = selectedFormReference ?
                                                                                    `${selectedFormReference.versionId}-${selectedFormReference.submissionDate}` : null;

                                                                                if ((!selectedFormReference || (keyFromSelectedReference && keyFromSelectedReference !== key))) {
                                                                                    this.props.setSelectedFormReference(form)
                                                                                } else {
                                                                                    this.props.setSelectedFormReference(null)
                                                                                }

                                                                            }} role="button" draggable="false"
                                                                               className="govuk-button"
                                                                               data-module="govuk-button">
                                                                                {selectedVersionAndKey ? `Hide details` : `Show details`}
                                                                            </a>
                                                                            <div>
                                                                                {selectedVersionAndKey ?
                                                                                    <FormDetailsPanel
                                                                                        key={key}
                                                                                        {...{
                                                                                            formReference: this.props.selectedFormReference,
                                                                                            businessKey: caseDetails.businessKey
                                                                                        }} /> : null}
                                                                            </div>
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
                                        </React.Fragment> : <h4 className="govuk-heading-s">No forms available</h4>}

                                </div>

                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
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

