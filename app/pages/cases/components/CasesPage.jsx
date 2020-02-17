import React from 'react';
import './CasePages.scss';
import CaseResultsPanel from "./CaseResultsPanel";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {findCasesByKey, reset, loadNextSearchResults} from '../actions';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import withLog from "../../../core/error/component/withLog";
import {businessKeyQuery, caseSearchResults, loadingNextSearchResults, searching} from "../selectors";
import {DebounceInput} from 'react-debounce-input';


class CasesPage extends React.Component {

    componentWillUnmount() {
        this.props.reset();
    }
    render() {
        const {caseSearchResults, searching, businessKeyQuery} = this.props;
        return <React.Fragment>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h3 className="govuk-heading-l">Cases</h3>
                    <div className="govuk-inset-text">
                        Enter a BF number to search for cases. <strong>Please note all actions are audited.</strong>
                    </div>
                </div>
                <div className="govuk-grid-column-one-third">
                    <div className="govuk-form-group input-icon">

                        <DebounceInput
                            minLength={3}
                            debounceTimeout={500}
                            spellCheck="false"
                            type="text"
                            className="govuk-input" placeholder="Search using a BF prefixed number" id="bfNumber"
                            onChange={event => {
                                const that = this;
                                const query = event.target.value;
                                if (query === '') {
                                    that.props.reset();
                                } else {
                                    that.props.findCasesByKey(query.toUpperCase());
                                }
                            }} /><i className="fa fa-search fa-lg" style={{marginLeft: '5px'}}/>


                    </div>
                </div>
            </div>
            <CaseResultsPanel {...{
                caseSearchResults, searching, businessKeyQuery, loadNext: () => {
                    const links = caseSearchResults._links;
                    if ('next' in links) {
                        const that = this;
                        const nextUrl = links.next.href;
                        _.throttle(that.props.loadNextSearchResults(nextUrl), 300);
                    }
                }
            }}/>
        </React.Fragment>
    }
}

CasesPage.propTypes = {
    log: PropTypes.func,
    findCasesByKey: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    loadNextSearchResults: PropTypes.func,
    businessKeyQuery: PropTypes.string,
    searching: PropTypes.bool,
    caseSearchResults: PropTypes.shape({
        _embedded: PropTypes.shape({
            cases: PropTypes.arrayOf(PropTypes.shape({
                businessKey: PropTypes.string,
                processInstances: PropTypes.arrayOf(PropTypes.object)
            }))
        }),
        _links: PropTypes.object,
        page: PropTypes.shape({
            size: PropTypes.number,
            totalElements: PropTypes.number,
            totalPages: PropTypes.number,
            number: PropTypes.number
        })
    })

};

const mapDispatchToProps = dispatch => bindActionCreators({findCasesByKey, reset, loadNextSearchResults}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        businessKeyQuery: businessKeyQuery(state),
        caseSearchResults: caseSearchResults(state),
        searching: searching(state),
        loadingNextSearchResults: loadingNextSearchResults(state)
    }
}, mapDispatchToProps)(withLog(CasesPage)));
