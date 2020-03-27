import React  from "react";
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actions from "../actions";
import {completeSuccessful} from "../selectors";

export class Complete extends React.Component {

    componentDidMount() {
        this.complete = this.complete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.completeSuccessful) {
            this.props.history.push("/tasks");
        }
    }

    complete() {
        this.props.completeTask(this.props.task.get('id'));
    }

    render() {
        const {task, kc} = this.props;
        const userId = kc.tokenParsed.email;
        const taskAssignee = task.get('assignee');
        const displayButton = taskAssignee && taskAssignee === userId;
        return displayButton ? (
          <button
            className="govuk-button"
            onClick={() => this.complete()}
            type="submit"
            disabled={!displayButton}
          >Complete
          </button>
) : <div />



    }

}

Complete.propTypes = {
    completeTask: PropTypes.func.isRequired,
    completeSuccessful: PropTypes.bool
};


const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        completeSuccessful: completeSuccessful(state)
    }
}, mapDispatchToProps)(Complete))
