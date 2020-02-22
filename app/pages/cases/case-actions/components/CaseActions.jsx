import React from 'react';
import PropTypes from "prop-types";
import CaseAction from "./CaseAction";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import withLog from "../../../../core/error/component/withLog";
import {setSelectedAction} from "../actions";
import {selectedAction} from "../selectors";

class CaseActions extends React.Component {

    componentDidMount() {
    }

    render() {
        const {caseDetails, selectedAction} = this.props;

        return <div className="govuk-grid-row govuk-card" id="caseActions">
            <div className="govuk-grid-column-full">
                <h3 className="govuk-heading-m">Case actions</h3>
                {caseDetails.actions.length !== 0 ?
                    <React.Fragment>
                        <nav id="case-action-nav">
                            <div className="case-action-navbar">
                                <ul className="case-action-navbar__list-items">
                                    {caseDetails.actions.map(action => {
                                        const key = action.process['process-definition'].key;
                                        const isSelected = selectedAction &&
                                            selectedAction.process['process-definition'].key === key;
                                         return <li key={key} className={isSelected ? 'active' : ''} >
                                            <a  href="#" onClick={event => {
                                                event.preventDefault();
                                                this.props.setSelectedAction(action);
                                            }}> {action.process['process-definition'].name}</a></li>
                                    })}
                                </ul>
                            </div>
                        </nav>
                       { selectedAction ? <CaseAction {...{selectedAction, caseDetails}} /> : null }
                    </React.Fragment>
                    : <h4 className="govuk-heading-s">No actions available</h4>
                }
            </div>
        </div>
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
                ['process-definition']: PropTypes.shape({
                    id: PropTypes.string,
                    key: PropTypes.string,
                    name: PropTypes.string
                })
            })
        }))
    })
};
const mapDispatchToProps = dispatch => bindActionCreators({setSelectedAction}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        selectedAction: selectedAction(state),
    }
}, mapDispatchToProps)(withLog(CaseActions)));

