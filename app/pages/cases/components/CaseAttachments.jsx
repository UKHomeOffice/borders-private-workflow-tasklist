import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {getCaseAttachments} from "../actions";
import {
    attachments,
    fetchingCaseAttachments,
} from "../selectors";
import withLog from "../../../core/error/component/withLog";

class CaseAttachments extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getCaseAttachments(this.props.businessKey);
    }

    render() {
        const {attachments, fetchingCaseAttachments} = this.props;

        return (
          <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
            <div className="govuk-grid-column-full">
              <h3 className="govuk-heading-m">Case attachments</h3>
              <details className="govuk-details" data-module="govuk-details">
                <summary className="govuk-details__summary">
                  <span className="govuk-details__summary-text">
                           View attachments
                  </span>
                </summary>
                <div className="govuk-grid-row govuk-!-margin-top-4">
                  <div className="govuk-grid-column-full">
                    <table className="govuk-table" style={{tableLayout: 'fixed'}}>
                      <caption className="govuk-table__caption">File details</caption>
                      <thead className="govuk-table__head">
                        <tr className="govuk-table__row">
                          <th scope="col" className="govuk-table__header">Name</th>
                          <th
                            scope="col"
                            className="govuk-table__header"
                          >Uploaded on
                          </th>
                          <th
                            scope="col"
                            className="govuk-table__header"
                          >Uploaded by
                          </th>
                        </tr>
                      </thead>
                      <tbody className="govuk-table__body">
                        {fetchingCaseAttachments ? (
                          <tr className="govuk-table__row">
                            <td><h4 className="govuk-heading-s">Loading attachments...</h4></td>
                          </tr>
                               ): (attachments && attachments.length !== 0 ? attachments.map(attachment => {
                                    return (
                                      <tr key={attachment.url} className="govuk-table__row">
                                        <th scope="row" className="govuk-table__header">
                                          <a
                                            className="govuk-link"
                                            href="#"
                                            onClick={e => {
                                                   e.preventDefault();
                                                   fetch(attachment.url, {
                                                       headers: {
                                                           'Authorization': this.props.kc.token
                                                       }
                                                   }).then(response => response.blob())
                                                       .then(blob => {
                                                           const url = window.URL.createObjectURL(new Blob([blob]));
                                                           const link = document.createElement('a');
                                                           link.href = url;
                                                           link.setAttribute('download', `${attachment.submittedFilename}`);
                                                           document.body.appendChild(link);
                                                           link.click();
                                                           link.parentNode.removeChild(link);
                                                       }).catch(error => {
                                                       this.props.log([
                                                           {
                                                               message: `Failed to download file ${attachment.submittedFilename}`,
                                                               error: error.toString()
                                                           }
                                                       ])
                                                   })
                                               }}
                                          >{attachment.submittedFilename}
                                          </a>
                                        </th>
                                        <td className="govuk-table__cell">{moment(attachment.submittedDateTime).format('DD-MM-YYYY HH:mm')}</td>
                                        <td className="govuk-table__cell" style={{wordWrap: 'break-word'}}>{attachment.submittedEmail}</td>
                                      </tr>
)
                                }) : (
                                  <h4 className="govuk-heading-s govuk-!-margin-top-4">
                                    No attachments associated with case
                                  </h4>
))}

                      </tbody>
                    </table>
                  </div>
                </div>
              </details>



            </div>
          </div>
)
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

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        fetchingCaseAttachments: fetchingCaseAttachments(state),
        attachments: attachments(state),
    }
}, mapDispatchToProps)(withLog(CaseAttachments)));

