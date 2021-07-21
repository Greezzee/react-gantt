import React, { Component } from 'react';
import Gantt from './Components/Gantt';
import Toolbar from './Components/Toolbar';
import './App.css';

const data = {
    data: [
        {id: 1, text: 'Task 1', start_date: '1-1-2001', duration: 4, progress: 0.6, priority: 'high'},
        {id: 2, text: 'Task 2', start_date: '2-1-2001', duration: 3, progress: 0.2},
        {id: 3, text: 'Task 3', start_date: '4-1-2001', duration: 1, progress: 0.8},
        {id: 4, text: 'Task 4', start_date: '7-1-2001', duration: 2, progress: 0.6},
        {id: 5, text: 'Task 5', start_date: '1-1-2001', duration: 8, progress: 0.1},
    ],
    links: [
        {id: 1, source: 1, target: 2, type: '0'},
        {id: 2, source: 2, target: 4, type: '1'},
        {id: 3, source: 3, target: 4, type: '1'},
    ]
};
class App extends Component {
    state = {
        currentZoom: 'Days',
    };

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom,
        });
    }

    render() {
        const { currentZoom } = this.state;
        return (
            <div>
                <div className='zoom-bar'>
                    <Toolbar
                        zoom={currentZoom}
                        onZoomChange={this.handleZoomChange}
                    />
                </div>
                <div className='gantt-container'>
                    <Gantt 
                        tasks={data}
                        zoom={currentZoom}
                    />
                </div>
            </div>
        )
    }
}

export default App;