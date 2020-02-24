import React  from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import * as actions from "../actions";
import {createStructuredSelector} from "reselect";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {loadingReports, reports} from "../selectors";
import DataSpinner from '../../../core/components/DataSpinner';
import AppConstants from '../../../common/AppConstants';

const uuidv4 = require('uuid/v4');


export class ReportsPage extends React.Component {
    componentDidMount() {
        document.title = `Reports | ${AppConstants.APP_NAME}`;
        this.props.fetchReportsList();
    }


    render() {
        const {loadingReports, reports} = this.props;
        const pointerStyle = {cursor: 'pointer'};
        const items = [];
        if (reports) {
            reports.forEach((report) => {
                items.push(<tr key={uuidv4()} id="report" style={pointerStyle} onClick={() => {
                    this.props.history.push(`/report?reportName=${report.get('htmlName')}`)
                }} className="govuk-table__row">
                    <td className="govuk-table__header">{report.get('name')}</td>
                    <td className="govuk-table__cell">{report.get('description')}</td>
                </tr>)
            });
        }

        return <div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                    <span className="govuk-caption-l">Operational reports</span>
                    <h2 className="govuk-heading-l" id="reportsCountLabel">{reports.size} {reports.size === 1 ? 'report' : 'reports'}</h2>
                </div>

            </div>
            {loadingReports ? <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}><DataSpinner
                message="Loading reports"/></div> : <div>
                <table className="govuk-table">
                    <tbody className="govuk-table__body">
                    {items}
                    </tbody>
                </table>
            </div>}
        </div>
    }
}


ReportsPage.propTypes = {
    fetchReportsList: PropTypes.func.isRequired,
    loadingReports: PropTypes.bool
};


const mapStateToProps = createStructuredSelector({
    reports: reports,
    loadingReports: loadingReports,

});


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportsPage));
