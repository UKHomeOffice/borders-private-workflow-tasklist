import FormioUtils from 'formiojs/utils';

export default class FormioInterpolator {

    interpolate(form, submission) {
        FormioUtils.eachComponent(form.components, component => {
            component.label = FormioUtils.interpolate(component.label, {
                data: submission
            });
            if (component.type === 'content') {
                component.html = FormioUtils.interpolate(component.html, {
                    data: submission
                });
            }
            if (component.defaultValue) {
                component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
                    data: submission
                });
            }
        });
    }
}
