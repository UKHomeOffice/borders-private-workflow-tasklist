import React from 'react';
import CustomBpmnViewer from './CustomBpmnViewer';
import ZoomControls from './ZoomControls';
import './bpmnio.css';

export default class ProcessViewer extends React.Component {

    componentDidMount() {

        document.body.className = 'shown';
        this.bpmnModeler = new CustomBpmnViewer({
            additionalModules: [],
            height: '100%',
            width: '100%',
            keyboard: {bindTo: document},
            container: '#canvas',
            moddleExtensions: {}
        });

        const {xml} = this.props;

        this.renderDiagram(xml);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {xml} = this.props;
        if (xml && xml !== prevProps.xml) {
            this.renderDiagram(xml);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    renderDiagram = xml => {
        this.bpmnModeler.importXML(xml, err => {
            if (err) {
                console.log('error rendering', err);
            } else {
                this.bpmnModeler.getDefinitions();
                this.scale = this.bpmnModeler.get('canvas').zoom('fit-viewport');
                console.log('successfully rendered');
            }
        });
    };

    handleZoom = () => {
        this.bpmnModeler.get('canvas').zoom(this.scale);
    };

    handleZoomIn = () => {
        this.scale += 0.1;
        this.handleZoom();
    };

    handleZoomOut = () => {
        if (this.scale <= 0.3) {
            this.scale = 0.2;
        } else {
            this.scale -= 0.1;
        }
        this.handleZoom();
    };

    handleZoomReset = () => {
        this.scale = this.bpmnModeler.get('canvas').zoom('fit-viewport');

    };

    render() {
        const {processDefinition} = this.props;
        return (
          <div>
            <div
              id="processName"
              style={{textAlign: 'center', marginTop: '5px'}}
              className="govuk-heading-m"
            >{processDefinition.getIn(['process-definition', 'name'])}
            </div>

            <div className="process-content">
              <div id="canvas" />
            </div>
            <ZoomControls
              onZoomIn={this.handleZoomIn}
              onZoomOut={this.handleZoomOut}
              onZoomReset={this.handleZoomReset}
            />
          </div>
);
    }
}
