import React from "react";
import CaseMetrics from "./CaseMetrics";
describe('CaseMetrics', () => {
    let props;
    beforeEach(() => {
        props = {
            caseDetails: {
                businessKey: 'businessKey',
                metrics: {
                    noOfCompletedUserTasks: 1,
                    noOfOpenUserTasks: 0,
                    noOfRunningProcessInstances: 1,
                    noOfCompletedProcessInstances: 1,
                    averageTimeToCompleteProcessInSeconds: 121121,
                    overallTimeInSeconds: 12121
                },
                actions: [{
                    process: {
                        "process-definition": {
                            "key": "test",
                            "name": "test"
                        }
                    }
                },
                    {
                        process: {
                            "process-definition": {
                                "key": "test2",
                                "name": "test2"
                            }
                        }
                    }]
            }
        };
    });
    it('renders metrics', () => {
        const wrapper = shallow(<CaseMetrics {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
