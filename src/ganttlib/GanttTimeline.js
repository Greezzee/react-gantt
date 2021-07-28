import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class GanttTimeline extends Component {
  static propTypes = {
    style: PropTypes.object.isRequired,
    UnitOffset: PropTypes.number.isRequired,
    isOnGanttRow: PropTypes.bool.isRequired
  };
  static contextTypes = {
    dateFormat: PropTypes.string.isRequired,
    timeFormat: PropTypes.string,
    secondFormat: PropTypes.string,
    hourFormat: PropTypes.string,
    dayFormat: PropTypes.string,
    weekFormat: PropTypes.string,
    monthFormat: PropTypes.string,
    yearFormat: PropTypes.string,
    debug: PropTypes.bool.isRequired,
    leftBound: PropTypes.object.isRequired,
    rightBound: PropTypes.object.isRequired,
    timelineWidth: PropTypes.number.isRequired
  };

  getTick(unit, timelineDuration) {
    const { style } = this.props;
    const { leftBound, rightBound, timelineWidth } = this.context;
    if (!unit) {
      timelineDuration = moment(rightBound).diff(moment(leftBound), 'seconds');
      unit = this.getTimespanUnit(timelineDuration);
    }
    const tickCount = Math.ceil(timelineDuration / this.units[unit]);
    const maxTicks = Math.ceil(timelineWidth / parseInt(style.minWidth, 15));
    if (tickCount > maxTicks) {
      const unitKeys = _.keys(this.units);
      const nextUnitIndex = unitKeys.indexOf(unit) + 1;
      if (unitKeys.length > nextUnitIndex) {
        unit = unitKeys[nextUnitIndex];
        return this.getTick(unit, timelineDuration);
      }
    }

    return {
      width: this.durationToWidth(this.units[unit]),
      unit,
      count: tickCount
    };
  }

  getTimespanIndex(duration) {
    if (duration / this.units.yeart >= 3) return 6;
    if (duration / this.units.month >= 3) return 5;
    if (duration / this.units.week >= 3) return 4;
    if (duration / this.units.day >= 3) return 3;
    if (duration / this.units.hour >= 3) return 2;
    if (duration / this.units.minute >= 3) return 1;
    return 0
  }

  getTimespanUnit(duration) {
    switch(this.getTimespanIndex(duration) + this.props.UnitOffset) {
      case 0: return 'second';
      case 1: return 'minute';
      case 2: return 'hour';
      case 3: return 'day';
      case 4: return 'week';
      case 5: return 'month';
      case 6: return 'year';
      default: return 'second';
    }
  }

  getTimeFormat(unit) {
    switch (unit) {
      case 'second':
        return this.context.secondFormat;
      case 'minute':
        return this.context.minuteFormat;
      case 'hour':
        return this.context.hourFormat;
      case 'day':
        return this.context.dayFormat;
      case 'week':
        return this.context.weekFormat;
      case 'month':
        return this.context.monthFormat;
      case 'year':
        return this.context.yearFormat;
    }
    return null;
  }

  units = {
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2628000,
    year: 31535965.4396976
  };

  durationToWidth(duration) {
    const { leftBound, rightBound, timelineWidth } = this.context;
    const timelineDuration = moment(rightBound).diff(leftBound, 'seconds');
    const percentage = duration > 0 ? duration / timelineDuration : 0;
    return timelineWidth * percentage;
  }

  widthToDuration(width) {
    const { leftBound, rightBound, timelineWidth } = this.context;
    const timelineDuration = moment(rightBound).diff(leftBound, 'seconds');
    const pixelPerSecond = timelineDuration / timelineWidth;
    return pixelPerSecond * width;
  }

  render() {
    const style = _.clone(this.props.style);
    const tick = this.getTick();
    const tickWidth = _.clone(parseInt(style.tickWidth, 10)) || 2;
    const paddingLeft = _.clone(parseInt(style.paddingLeft, 10)) || 4;
    delete style.paddingLeft;

    const color = this.props.UnitOffset ? '#00000' : '#AAAAAA';

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        {_.map(_.range(tick.count), index => {
          return (
            <div
              key={`tick${index}`}
              style={{
                ...style,
                borderLeft: `${tickWidth}px`,
                borderLeftStyle: 'solid',
                borderLeftColor: color,
                width: `${Math.min(tick.width - paddingLeft - tickWidth, window.innerWidth)}px`,
                float: 'left',
                margin: '0px',
                padding: '0px',
                textAlign: 'center',
                paddingLeft: `${paddingLeft}px`
              }}
            >
              {this.renderTickLabel(tick, index)}
            </div>
          );
        })}
      </div>
    );
  }

  renderTickLabel(tick, index) {
    if (!this.props.isOnGanttRow) {
      const { leftBound } = this.context;
      const tickTime = moment(leftBound).add(
        this.widthToDuration(tick.width) * index,
        'seconds'
      );
      const format = this.getTimeFormat(tick.unit);
      return tickTime.format(format);
    }
    return ''
  }
}