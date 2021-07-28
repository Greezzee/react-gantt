import ReactGantt, { GanttRow } from './ganttlib';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import moment from 'moment';
class Demo extends Component {
  render() {
    return (
      <ReactGantt
        templates={{
          myTasks: {
            title: 'My Tasks',
            steps: [
              {
                name: 'Task Phase One',
                color: '#6699FF'
              },
              {
                name: 'Task Phase Two',
                color: '#FF9955'
              }
            ]
          }
        }}
        leftBound={moment().set({hour: 0, date: 1, month: 0, year: 2021}).toDate()}
        rightBound={moment().set({hour: 0, date: 1, month: 3, year: 2021}).toDate()}
      >
        <GanttRow
          title="Task 1"
          templateName="myTasks"
          steps={[
            moment().set({hour: 0, date: 1, month: 0, year: 2021}).toDate(),
            moment().set({hour: 0, date: 15, month: 0, year: 2021}).toDate(),
            moment().set({hour: 0, date: 30, month: 0, year: 2021}).toDate()
          ]}
        />
        <GanttRow
          title="Task 2"
          templateName="myTasks"
          steps={[
            moment().set({hour: 0, date: 1, month: 0, year: 2021}).toDate(),
            moment().set({hour: 0, date: 1, month: 2, year: 2021}).toDate(),
            moment().set({hour: 0, date: 1, month: 3, year: 2021}).toDate()
          ]}
        />
      </ReactGantt>
    );
  }
}

ReactDOM.render(
    <Demo></Demo>,
    document.getElementById('root')
);