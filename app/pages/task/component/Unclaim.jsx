import React from "react";
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actions from "../actions";
import { submittingUnclaim, unclaimSuccessful } from '../selectors';

class Unclaim extends React.Component {


    componentWillReceiveProps(nextProps) {
        if (nextProps.unclaimSuccessful) {
            this.props.history.replace("/your-group-tasks");
        }
    }


    render() {
        const {task, kc, submittingUnclaim} = this.props;
        const taskId = task.get('id');
        const userId = kc.tokenParsed.email;
        const taskAssignee = task.get('assignee');
        const displayButton = taskAssignee && taskAssignee === userId;

        return displayButton ?
          <input id={'claimTask'+ taskId}
                 className="btn btn-primary"
                 disabled={submittingUnclaim}
                 onClick={() => {
                     this.props.unclaimTask(this.props.task.get('id'));
                 }} type="submit"
                 value={"Unclaim"}/> : <div/>;
    }

}

Unclaim.propTypes = {
    unclaimTask: PropTypes.func.isRequired,
    handleSuccessfulUnclaim: PropTypes.func,
    unclaimSuccessful: PropTypes.bool,
    submittingUnclaim: PropTypes.bool
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        unclaimSuccessful: unclaimSuccessful(state),
        submittingUnclaim: submittingUnclaim(state)
    }
}, mapDispatchToProps)(Unclaim))
