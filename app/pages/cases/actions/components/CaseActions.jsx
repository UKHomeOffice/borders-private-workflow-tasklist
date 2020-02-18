import React from 'react';
import {Form} from "react-formio";
import PropTypes from "prop-types";
import {Tabs} from 'govuk-frontend'

class CaseActions extends React.Component {

    componentDidMount() {
        new Tabs(document.getElementById("caseActions")).init();
    }

    render() {
        const {caseDetails} = this.props;
        return <div className="govuk-grid-row" id="caseActions">
            <div className="govuk-grid-column-full">
                <h3 className="govuk-heading-m">Case actions</h3>
                {caseDetails.actions.length !== 0 ?
                    <div className="govuk-tabs" data-module="govuk-tabs">
                        <ul className="govuk-tabs__list">
                            {caseDetails.actions.map(action => {
                                const processAction = action.process['process-definition'];
                                return <li key={processAction.key}
                                           className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                                    <a className="govuk-tabs__tab" href={`#${processAction.key}`}
                                       onClick={e => e.preventDefault()}>
                                        {processAction.name}
                                    </a>
                                </li>
                            })}
                        </ul>
                        {caseDetails.actions.map(action => {
                            const processAction = action.process['process-definition'];
                            return <section key={processAction.key} className="govuk-tabs__panel" id={processAction.key}>

                            </section>
                        })}
                    </div>
                    : <h4 className="govuk-heading-s">No actions available</h4>
                }
            </div>
        </div>
    }
}

CaseActions.propTypes = {
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
export default CaseActions;
