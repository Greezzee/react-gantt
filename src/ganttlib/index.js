import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import GanttTimeline from './GanttTimeline';

export { default as GanttRow } from './GanttRow';

export default class ReactGantt extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dateFormat: PropTypes.string,
    dayFormat: PropTypes.string,
    debug: PropTypes.bool,
    hourFormat: PropTypes.string,
    leftBound: PropTypes.object,
    minuteFormat: PropTypes.string,
    monthFormat: PropTypes.string,
    rightBound: PropTypes.object,
    secondFormat: PropTypes.string,
    style: PropTypes.object,
    templates: PropTypes.object,
    timeFormat: PropTypes.string,
    timelineStyle: PropTypes.object,
    weekFormat: PropTypes.string,
    yearFormat: PropTypes.string
  };
  static childContextTypes = {
    dateFormat: PropTypes.string.isRequired,
    dayFormat: PropTypes.string,
    debug: PropTypes.bool.isRequired,
    hourFormat: PropTypes.string,
    leftBound: PropTypes.object.isRequired,
    minuteFormat: PropTypes.string,
    monthFormat: PropTypes.string,
    rightBound: PropTypes.object.isRequired,
    secondFormat: PropTypes.string,
    templates: PropTypes.object.isRequired,
    timeFormat: PropTypes.string,
    timelineWidth: PropTypes.number.isRequired,
    weekFormat: PropTypes.string,
    yearFormat: PropTypes.string
  };
  static defaultProps = {
    dateFormat: 'DD.MM.YYYY',
    dayFormat: 'DD',
    debug: false,
    hourFormat: 'HH',
    leftBound: moment().toDate(),
    minuteFormat: 'HH:MM',
    monthFormat: 'MMM',
    rightBound: moment().toDate(),
    secondFormat: 'HH:MM:SS',
    style: {},
    templates: {},
    timeFormat: 'HH:MM DD.MM.YYYY',
    timelineStyle: { minWidth: '60px', height: '20px' },
    weekFormat: '[#]ww',
    yearFormat: 'YYYY'
  };

  state = {
    timelineWidth: 0
  };

  getChildContext() {
    return {
      dateFormat: this.props.dateFormat,
      dayFormat: this.props.dayFormat,
      debug: this.props.debug,
      hourFormat: this.props.hourFormat,
      leftBound: this.props.leftBound,
      minuteFormat: this.props.minuteFormat,
      monthFormat: this.props.monthFormat,
      rightBound: this.props.rightBound,
      secondFormat: this.props.secondFormat,
      templates: this.props.templates,
      timeFormat: this.props.timeFormat,
      timelineWidth: this.state.timelineWidth,
      weekFormat: this.props.weekFormat,
      yearFormat: this.props.yearFormat
    };
  }

  componentDidMount() {
    this.resizeEventListener = window.addEventListener('resize', e =>
      this.handleResize(e)
    );
    this.handleResize();
  }

  componentWillUnmount() {
    if (this.resizeEventListener) {
      this.resizeEventListener.removeEventListener();
    }
  }

  handleResize() {
    this.setState({ timelineWidth: 0 });
    this.setState({ timelineWidth: this.refs.timeline.offsetWidth });
  }

  render() {
    const thStyle = { whiteSpace: 'nowrap' };
    return (
      <div style={this.props.style}>
        <table style={{ width: '100%' }} cellSpacing={0} border={1}>
          <thead>
            <tr>
              <th
                style={{
                  ...thStyle,
                  width: '0px'
                }}
              />
              <th
                ref="timeline"
                style={{
                  ...thStyle,
                  width: '100%'
                }}
              >
                <GanttTimeline
                  style={this.props.timelineStyle}
                  rows={this.props.children}
                  UnitOffset={1}
                  isOnGanttRow={false}
                />
              </th>
            </tr>
            <tr>
              <th
                style={{
                  ...thStyle,
                  width: '0px'
                }}
              />
              <th
                ref="timeline"
                style={{
                  ...thStyle,
                  width: '100%'
                }}
              >
                <GanttTimeline
                  style={this.props.timelineStyle}
                  rows={this.props.children}
                  UnitOffset={0}
                  isOnGanttRow={false}
                />
              </th>
            </tr>
          </thead>
          <tbody>{this.props.children}</tbody>
        </table>
      </div>
    );
  }
}