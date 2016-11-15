import './styles/tappable.less';
import React, { Component } from 'react';
import classnames from 'classnames';

const activeClass = 'tappable-active';
const inactiveClass = 'tappable-inactive';
const pressedClass = 'tappable-pressed';
const pressDelay = 2;

const isWithinBounds = (value, lower, upper) => lower <= value && value <= upper;

class Tappable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: undefined,
      pressed: false,
      active: false,
    }
  }

  componentWillMount = () => {
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount = () => {
    this.cancelTimeout();

    window.addEventListener('mouseup', this.onMouseUp);
  }

  cancelTimeout = () => {
    window.clearTimeout(this.state.timer);
  }

  handleEvent = evt => {
    if (evt.preventDefault) evt.preventDefault();
    if (evt.stopPropagation) evt.stopPropagation();
  }

  onTouchStart = evt => {
    console.log('Touch Start');
    this.handleEvent(evt);

    if (evt.touches.length !== 1) {
      return;
    }

    this.startInteraction();
  }

  onTouchEnd = evt => {
    console.log('Touch End');
    this.handleEvent(evt);

    if (evt.changedTouches.length !== 1 || evt.touches.length !== 0) {
      return;
    }

    this.endInteraction(evt.target, evt.changedTouches[0]);
  }

  onMouseDown = evt => {
    console.log('Mouse Down');
    this.handleEvent(evt);

    this.startInteraction();
  }

  onMouseUp = evt => {
    //console.log('Mouse Up', evt.pageX);
    //this.handleEvent(evt);

    this.endInteraction(evt.target, evt);
  }

  startInteraction = () => {
    if (!this.state.timer) {
      const timer = setTimeout(() => {
          this.setState({
            pressed: true,
          });
          console.log('Timer fired');
        },
        pressDelay * 1000);
      this.setState({timer});
      console.log('Timer started');
    }

    this.setState({
      active: true,
    });
  }

  endInteraction = (target, { pageX, pageY }) => {
    if (!this.state.active) {
      return
    }

    const { pressed } = this.state;
    this.cancelTimeout();
    this.setState({
      timer: undefined,
      pressed: false,
      active: false,
    });

    const bounds = target.getBoundingClientRect();

    if (!isWithinBounds(pageX, bounds.left, bounds.right) ||
        !isWithinBounds(pageY, bounds.top, bounds.bottom)) {
      return;
    }

    console.log(pressed ? 'Pressed' : 'Tapped');
  }

  render = () => {
    const classes = classnames('tappable', this.props.className, {
      [inactiveClass]: !this.state.active,
      [activeClass]: this.state.active && !this.state.pressed,
      [pressedClass]: this.state.pressed,
    });

    return (
      <div className={classes}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onMouseDown={this.onMouseDown}>
        {this.props.children}
      </div>
    );
  }
};

export default Tappable;
