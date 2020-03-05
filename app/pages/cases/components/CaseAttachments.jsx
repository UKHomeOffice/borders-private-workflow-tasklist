import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import {bindActionCreators} from "redux";
import {getCaseAttachments} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {
    attachments,
    fetchingCaseAttachments,
} from "../selectors";
import withLog from "../../../core/error/component/withLog";

class CaseAttachments extends React.Component {
    componentDidMount() {
        this.props.getCaseAttachments(this.props.businessKey);
    }

    render() {
        const {attachments, businessKey, fetchingCaseAttachments} = this.props;

        return <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
            <div className="govuk-grid-column-full">
                <h3 className="govuk-heading-m">Case attachments</h3>
                {fetchingCaseAttachments ? <h4 className="govuk-heading-s">
                        Loading attachments for {businessKey} ...
                    </h4>
                    : <details className="govuk-details" data-module="govuk-details">
                        <summary className="govuk-details__summary">
                        <span className="govuk-details__summary-text">
                           View attachments
                        </span>
                        </summary>
                        <div className="govuk-grid-row govuk-!-margin-top-4">
                            <div className="govuk-grid-column-full">
                                <table className="govuk-table">
                                    <caption className="govuk-table__caption">File details</caption>
                                    <thead className="govuk-table__head">
                                    <tr className="govuk-table__row">
                                        <th scope="col" className="govuk-table__header govuk-!-width-one-half">Name</th>
                                        <th scope="col"
                                            className="govuk-table__header govuk-!-width-one-quarter">Uploaded on
                                        </th>
                                        <th scope="col"
                                            className="govuk-table__header govuk-!-width-one-quarter">Uploaded by
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="govuk-table__body">
                                    {attachments && attachments.length !== 0 ? attachments.map(attachment => {
                                        return <tr key={attachment.url} className="govuk-table__row">
                                            <th scope="row" className="govuk-table__header">
                                                <a className="govuk-link" href="#"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       window.open(attachment.url);
                                                   }}>{attachment.submittedFilename}</a>
                                            </th>
                                            <td className="govuk-table__cell">{moment(attachment.submittedDateTime).format('DD-MM-YYYY HH:mm')}</td>
                                            <td className="govuk-table__cell">{attachment.submittedEmail}</td>
                                        </tr>
                                    }) : <h4 className="govuk-heading-s govuk-!-margin-top-4">
                                        No attachments associated with case
                                    </h4>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </details>}

            </div>
        </div>
    }
}

CaseAttachments.propTypes = {
    businessKey: PropTypes.string,
    getCaseAttachments: PropTypes.func,
    fetchingCaseAttachments: PropTypes.bool,
    attachments: PropTypes.arrayOf(PropTypes.shape({
        submittedFilename: PropTypes.string,
        submittedEmail: PropTypes.string,
        submittedDateTime: PropTypes.string,
        url: PropTypes.string
    }))
};


const mapDispatchToProps = dispatch => bindActionCreators({getCaseAttachments},
    dispatch);

export default withRouter(connect((state) => {
    return {
        fetchingCaseAttachments: fetchingCaseAttachments(state),
        attachments: attachments(state),
    }
}, mapDispatchToProps)(withLog(CaseAttachments)));

