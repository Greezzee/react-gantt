import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import GanttBar from './GanttBar';
import GanttTimeline from './GanttTimeline';

export default class GanttRow extends Component {
  static propTypes = {
    barStyle: PropTypes.object,
    markerStyle: PropTypes.object,
    steps: PropTypes.array.isRequired,
    templateName: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };
  static contextTypes = {
    templates: PropTypes.object.isRequired,
    dateFormat: PropTypes.string.isRequired,
    leftBound: PropTypes.object.isRequired,
    rightBound: PropTypes.object.isRequired,
    timelineWidth: PropTypes.number.isRequired,
    debug: PropTypes.bool.isRequired
  };
  static defaultProps = {
    barStyle: {
      height: '80px',
      marginTop: '10px',
      marginBottom: '10px'
    },
    markerStyle: {
      width: '40px',
      backgroundColor: '#000000',
      opacity: 0.5
    },
    templateName: 'default',
    title: '',
    description: ''
  };

  state = {
    active: false,
    mouse: {},
    activeStep: {},
    markerTime: moment().toDate()
  };

  getStepFromTime(time) {
    const { steps, templateName } = this.props;
    const { templates } = this.context;
    let templateStep = {};
    const templateSteps = templates[templateName].steps;
    _.each(steps, (step, index) => {
      if (
        moment(time).isAfter(step) &&
        moment(time).isBefore(steps[index + 1])
      ) {
        templateStep = templateSteps[index];
        return false;
      }
      return true;
    });
    return templateStep;
  }

  getMargin(margin) {
    let marginTop = '0px';
    let marginRight = '0px';
    let marginBottom = '0px';
    let marginLeft = '0px';
    margin = margin ? margin.split(' ') : [];
    switch (margin.length) {
      case 1:
        [marginTop] = margin;
        [marginRight] = margin;
        [marginBottom] = margin;
        [marginLeft] = margin;
        break;
      case 2:
        [marginTop] = margin;
        [, marginRight] = margin;
        [marginBottom] = margin;
        [, marginLeft] = margin;
        break;
      case 4:
        [marginTop] = margin;
        [, marginRight] = margin;
        [, , marginBottom] = margin;
        [, , , marginLeft] = margin;
        break;
      default:
        [marginTop] = margin;
        [marginRight] = margin;
        [marginBottom] = margin;
        [marginLeft] = margin;
    }
    return {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft
    };
  }

  calculateBarStyle(barStyle) {
    barStyle = _.clone(barStyle);
    const margin = this.getMargin(barStyle.margin);
    const marginTop = barStyle.marginTop || margin.marginTop;
    const marginBottom = barStyle.marginBottom || margin.marginBottom;
    delete barStyle.marginTop;
    delete barStyle.marginBottom;
    delete barStyle.margin;
    return {
      barStyle,
      barWrapperStyle: {
        marginTop,
        marginBottom
      }
    };
  }

  widthToDuration(width) {
    const { leftBound, rightBound, timelineWidth } = this.context;
    const timelineDuration = moment(rightBound).diff(leftBound, 'seconds');
    const pixelPerSecond = timelineDuration / timelineWidth;
    return pixelPerSecond * width;
  }

  render() {
    const { title, templateName, steps } = this.props;
    const tdStyle = { whiteSpace: 'nowrap' };
    const { barStyle, barWrapperStyle } = this.calculateBarStyle(
      this.props.barStyle
    );
    return (
      <tr style={{ cursor: 'inherit' }} lineHeight={15}>
        <td
          style={{
            ...tdStyle,
            width: '0px'
          }}
        >
          {title}
        </td>
        <td
          style={{
            ...tdStyle,
            width: '100%'
          }}
        >
          <div style={{position: 'relative', zIndex: -1, top: 0, left: 0, height: 0 }}>
            <GanttTimeline
                  style={{minWidth: '60px', height: '100px'}}
                  UnitOffset={0}
                  isOnGanttRow={true}
            />
            </div>
          <div style={barWrapperStyle}>
            <div style={{position: 'relative', zIndex: 0, top: 0, left: 0 }}>
            <GanttBar
              title={title}
              templateName={templateName}
              steps={steps}
              style={barStyle}
            />
            </div>
          </div>
        </td>
      </tr>
    );
  }
}