import PubSub from "pubsub-js";

class FormioEventListener {
    constructor(form, props) {
        this.form = form;
        this.props = props;
        this.initialize();
    }

    initialize() {
        this.form.formio.on('error', errors => {
            PubSub.publish('formSubmissionError', {
                errors,
                form: this.form
            });
            window.scrollTo(0, 0);
        });
        this.form.formio.on('submit', () => {
            PubSub.publish('formSubmissionSuccessful');
        });
        this.form.formio.on('change', value => {
            const {form} = this;
            PubSub.publish('formChange', {value, form});
        });
        this.form.formio.on('prevPage', () => {
            window.scrollTo(0, 0);
            PubSub.publish('clear');
        });
        this.form.formio.on('nextPage', () => {
            window.scrollTo(0, 0);
        });
        this.form.formio.on('componentError', error => {
            if (this.props.log && (typeof this.props.log === 'function')) {
                this.props.log([{
                    url: document.referrer,
                    browserCode: navigator.appCodeName,
                    browserName: navigator.appName,
                    browserVersion: navigator.appVersion,
                    platform: navigator.platform,
                    user: this.props.kc.tokenParsed.email,
                    form: this.form.formio._form.name,
                    level: 'error',
                    message: error.message,
                    error
                }]);
            }
        });

    }
}

export default FormioEventListener;
