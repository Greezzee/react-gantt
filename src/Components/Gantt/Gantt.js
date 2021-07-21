import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';
import './Gantt.css'

export default class Gantt extends Component {
    componentDidMount(props){
        //super(props);
        const { tasks } = this.props;
        gantt.config.fit_tasks = true;
        gantt.config.scroll_size = 20;
        gantt.init(this.ganttContainer);
        gantt.config.layout = {
            css: 'gantt_container',
            rows: [
                {
                    cols: [
                        {
                            view: 'grid',
                            scrollX: 'scrollHor',
                            scrollY: 'scrollVer',
                            scrollable: false,
                        },
                        { resizer: true, width: 1, },
                        {
                            view: 'timeline',
                            scrollX: 'scrollHor',
                            scrollY: 'scrollVer',
                            scrollable: true,
                        },
                        {
                            view: 'scrollbar',
                            id: 'scrollVer'
                        }
                    ]        
                },
                {
                    view: 'scrollbar',
                    id: 'scrollHor',
                    height: 20,
                }
            ]
        }
        gantt.resetLayout();
        gantt.parse(tasks);
    }

    setZoom(value) {
        switch (value) {
            case 'Hours':
                gantt.config.scale_unit = 'day';
                gantt.config.date_scale = '%d %M';
                gantt.config.scale_height = 60;
                gantt.config.min_column_width = 30;
                gantt.config.subscales = [
                    {unit: 'hour', step: 1, date: '%H'}
                ];
                break;
            case 'Days':
                gantt.config.scale_unit = 'week';
                gantt.config.date_scale = '#%W';
                gantt.config.scale_height = 60;
                gantt.config.min_column_width = 70;
                gantt.config.subscales = [
                    {unit: 'day', step: 1, date: '%d %M'}
                ];
                break;
            case 'Months':
                gantt.config.scale_unit = 'month';
                gantt.config.date_scale = '%F';
                gantt.config.scale_height = 60;
                gantt.config.min_column_width = 70;
                gantt.config.subscales = [
                    {unit: 'week', step: 1, date: '#%W'}
                ];
                break;
            default:
                break;
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.zoom !== nextProps.zoom;
    }

    componentDidUpdate() {
        gantt.render();
    }

    render() {
        const { zoom } = this.props;
        this.setZoom(zoom);

        return (
            <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ {width: '100%', height: '100%'} }
            ></div>
        )
    }
}