import React from "react";
import Iframe from "react-iframe";

import queryString from 'query-string';
import {withRouter} from "react-router";

export class ReportPage extends React.Component {

    render() {

        const params = queryString.parse(this.props.location.search);
        const reportName = params.reportName;
        const pointerStyle = {cursor: 'pointer', paddingTop: '10px', textDecoration: 'underline', paddingBottom: '10px', display: 'inline-block'};

        return <div>
            <div id="backToReports" style={pointerStyle} onClick={() => this.props.history.replace('/reports')}>Back to reports</div>

            <div style={{
                display: 'flex',
                position: 'relative',
                margin: 'auto',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <Iframe url={`/api/reports/${reportName}`}
                        id="report"
                        width="100%"
                        height="100%"
                        position="relative"
                        display="initial"
                        allowFullScreen/>
            </div>
        </div>
    }
}

export default withRouter(ReportPage);
