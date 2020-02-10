import React from 'react';

class CaseResultsPanel extends React.Component {
    render() {
        const {searching, caseSearchResults, businessKeyQuery} = this.props;

        if (searching) {
            return <h4 className="govuk-heading-s">Searching cases with reference {businessKeyQuery}...</h4>
        }
        if (!caseSearchResults) {
            return <div/>
        }

        if (caseSearchResults.page.totalElements === 0) {
            return <h4 className="govuk-heading-s">No cases found with with reference {businessKeyQuery}</h4>
        }
        const businessKeys = caseSearchResults._embedded.cases.map(c => {
            return <li key={c.businessKey}><a className="govuk-link" href="#">{c.businessKey}</a></li>
        });
        return <div>
            <ul className="govuk-list">
                {businessKeys}
            </ul>
        </div>
    }
}

export default CaseResultsPanel;
