import React from 'react';
import Immutable from 'immutable';
import ProcessViewer from './ProcessViewer';

const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1eji8v1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.1">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_1twdhp6</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_0u8xc97">
      <bpmn:incoming>SequenceFlow_1twdhp6</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_13u4m5z</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_1twdhp6" sourceRef="StartEvent_1" targetRef="Task_0u8xc97" />
    <bpmn:endEvent id="EndEvent_0lg14k1">
      <bpmn:incoming>SequenceFlow_13u4m5z</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_13u4m5z" sourceRef="Task_0u8xc97" targetRef="EndEvent_0lg14k1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="195" y="244" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_0u8xc97_di" bpmnElement="Task_0u8xc97">
        <dc:Bounds x="281" y="222" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1twdhp6_di" bpmnElement="SequenceFlow_1twdhp6">
        <di:waypoint x="231" y="262" />
        <di:waypoint x="281" y="262" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0lg14k1_di" bpmnElement="EndEvent_0lg14k1">
        <dc:Bounds x="431" y="244" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_13u4m5z_di" bpmnElement="SequenceFlow_13u4m5z">
        <di:waypoint x="381" y="262" />
        <di:waypoint x="431" y="262" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;


describe('Process viewer', () => {
  it('renders a process', async () => {
    const wrapper = await mount(<ProcessViewer
      xml={xmlStr}
      processDefinition={Immutable.fromJS({
        'process-definition': {
          name: 'processName',
        },
      })}
    />, { attachTo: document.body });
    console.log(wrapper.html());
    const bjsContainer = document.querySelector('.bjs-container');
    const zoomContainer = document.querySelector('.io-zoom-controls');
    expect(bjsContainer).toBeDefined();
    expect(zoomContainer).toBeDefined();

    const reset = document.querySelector('.icon-size-reset');
    expect(reset).toBeDefined();
  });
});
