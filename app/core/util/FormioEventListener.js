import PubSub from "pubsub-js";

class FormioEventListener {
    constructor(form, props) {
        this.form = form;
        this.props = props;
    }

    initialize() {
        this.form.formio.on('error', errors => {
            PubSub.publish('formSubmissionError', {
                errors: errors,
                form: this.form
            });
            window.scrollTo(0, 0);
        });
        this.form.formio.on('submit', () => {
            PubSub.publish('formSubmissionSuccessful');
        });
        this.form.formio.on('change', (value) => {
            PubSub.publish('formChange', value);
        });
        this.form.formio.on('prevPage', () => {
            window.scrollTo(0, 0);
            PubSub.publish('clear');
        });
        this.form.formio.on('nextPage', () => {
            window.scrollTo(0, 0);
        });

    }
}

export default FormioEventListener;
