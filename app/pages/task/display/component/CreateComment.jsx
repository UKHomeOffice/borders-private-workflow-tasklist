import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Form } from 'react-formio';
import * as actions from '../actions';
import { form, isFetchingCreateCommentForm } from '../selectors';
import './Comment.scss';

class CreateComment extends React.Component {

  componentDidMount() {
    this.props.fetchCreateCommentForm();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.form;
  }


  renderForm() {
    const { isFetchingCreateCommentForm, form} = this.props;
    if (isFetchingCreateCommentForm) {
      return <div>Loading....</div>;
    }

    const options = {
      noAlerts: true,
    };
    if (form) {
      return (
        <div><Form
          form={form}
          options={options}
          ref={form => this.form = form}
          onSubmit={submission => {
          this.props.createComment({ taskId: this.props.taskId, comment: submission.data });
          this.form.formio.resetValue();
          this.form.formio.emit('submitDone');
          this.form.formio.triggerRedraw();
        }}
        />
        </div>
);
    }
    return <div />;
  }

  render() {
    return (
      <div id="commentContainer">
        {this.renderForm()}
      </div>
);
  }
}


CreateComment.propTypes = {
  fetchCreateCommentForm: PropTypes.func.isRequired,
  createComment: PropTypes.func.isRequired,
  isFetchingCreateCommentForm: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  isFetchingCreateCommentForm,
  form
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateComment);

