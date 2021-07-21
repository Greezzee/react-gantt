import React, { Component } from 'react';
import Gantt from './Components/Gantt';
import Toolbar from './Components/Toolbar';
import './App.css';

const data = {
    data: [
        {id: 1, text: 'Task 1', start_date: '1-1-2001', duration: 30, progress: 0.6, priority: 'high'},
        {id: 2, text: 'Task 2', start_date: '2-1-2001', duration: 3, progress: 0.6},
    ],
    links: [
        {id: 1, source: 1, target: 2, type: '0'}
    ]
};

for(let i = 0; i < 500; i++) {
    data.data.push({id: 3 + i, text: 'Task ' + (3 + i), start_date: '1-1-2001', duration: i * 2, progress: 0.6, priority: 'high'})
}
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