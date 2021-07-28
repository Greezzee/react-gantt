import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

export default class GanttBar extends Component {
  static propTypes = {
    templateName: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired
  };
  static contextTypes = {
    templates: PropTypes.object.isRequired,
    dateFormat: PropTypes.string.isRequired,
    debug: PropTypes.bool.isRequired,
    leftBound: PropTypes.object.isRequired,
    rightBound: PropTypes.object.isRequired,
    timelineWidth: PropTypes.number.isRequired,
    activeRow: PropTypes.number
  };

  getSteps() {
    const { templates } = this.context;
    const { templateName } = this.props;
    const template = templates[templateName];
    return _.map(template.steps, (step, index) => {
      return this.getStep(index, template);
    });
  }

  getStep(index, template) {
    const { leftBound, rightBound } = this.context;
    const { steps } = this.props;
    const stepStartTime = steps[index];
    const stepEndTime = template.steps.length > index ? steps[index + 1] : null;
    if (!stepEndTime) return null;
    const stepDuration = moment(stepEndTime).diff(stepStartTime, 'seconds');
    const theoreticalWidth = this.durationToWidth(stepDuration);
    const startPixel = this.timeToPixel(stepStartTime);
    const endPixel = this.timeToPixel(stepEndTime);
    const displayWidth = endPixel - startPixel;
    let offTimelineLeft = false;
    let offTimelineRight = false;
    if (moment(stepStartTime).diff(moment(leftBound), 'seconds') < 0) {
      offTimelineLeft = true;
    }
    if (moment(rightBound).diff(moment(stepEndTime), 'seconds') < 0) {
      offTimelineRight = true;
    }
    return {
      name: template.steps[index].name,
      color: template.steps[index].color,
      duration: stepDuration,
      theoreticalWidth,
      displayWidth,
      startPixel,
      endPixel,
      offTimelineLeft,
      offTimelineRight,
      startTime: stepStartTime,
      endTime: stepEndTime
    };
  }

  durationToWidth(duration) {
    const { leftBound, rightBound, timelineWidth } = this.context;
    const timelineDuration = moment(rightBound).diff(leftBound, 'seconds');
    const percentage = duration > 0 ? duration / timelineDuration : 0;
    return timelineWidth * percentage;
  }

  timeToPixel(time) {
    const { leftBound, timelineWidth } = this.context;
    const leftBoundPixel = 0;
    const rightBoundPixel = timelineWidth;
    const timeDurationFromLeftBound = moment(time).diff(leftBound, 'seconds');
    const timeWidthFromLeftBound = this.durationToWidth(
      timeDurationFromLeftBound
    );
    const pixel = timeWidthFromLeftBound;
    if (leftBoundPixel < pixel && pixel < rightBoundPixel) return pixel;
    if (pixel <= leftBoundPixel) return leftBoundPixel;
    if (pixel >= rightBoundPixel) return rightBoundPixel;
    return null;
  }

  render() {
    const { style } = this.props;
    const steps = this.getSteps();
    const stepCount = steps.length;
    return (
      <div ref="bar" style={{ display: 'flex' }}>
        {_.map(steps, (step, index) => {
          return (
            <div key={`reg${step.name}${index}`}>
              <div
                style={{
                  ...style,
                  borderTopLeftRadius: step.offTimelineLeft || index != 0 ? '0%' : '20px',
                  borderBottomLeftRadius: step.offTimelineLeft  || index != 0 ? '0%' : '20px',
                  borderTopRightRadius: step.offTimelineRight  || index != stepCount - 1 ? '0%' : '20px',
                  borderBottomRightRadius: step.offTimelineRight || index != stepCount - 1 ? '0%' : '20px',
                  width: `${step.displayWidth}px`,
                  backgroundColor: step.color,
                  marginLeft: index === 0 ? `${step.startPixel}px` : '0px'
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}