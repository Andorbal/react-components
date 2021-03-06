import './styles/tappable.less';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const asMilliseconds = 1000;
const isWithinBounds = (value, lower, upper) => lower <= value && value <= upper;

class Tappable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false,
      active: false,
    };

    this.touches = [];
    this.timer = undefined;
  }

  static defaultProps = {
    className: 'tappable',
    pressDelay: 2,
  };

  componentWillMount = () => {
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount = () => {
    this.cancelTimeout();
    this.setState({
      pressed: false,
      active: false,
    });

    window.removeEventListener('mouseup', this.onMouseUp);
  }

  cancelTimeout = () => {
    window.clearTimeout(this.timer);
    this.timer = undefined;
  }

  handleEvent = evt => {
    if (evt.preventDefault) evt.preventDefault();
    if (evt.stopPropagation) evt.stopPropagation();
  }

  onTouchStart = evt => {
    this.handleEvent(evt);

    const { identifier } = evt.changedTouches[0];

    if (!this.touches.includes(identifier)) {
      this.touches.push(identifier);
    }

    this.startInteraction();
  }

  onTouchEnd = evt => {
    this.handleEvent(evt);
    const touch = evt.changedTouches[0];

    this.touches = this.touches.filter(x => x !== touch.identifier);

    if (this.touches.length !== 0) {
      return;
    }

    this.endInteraction(evt.target, touch);
  }

  onMouseDown = evt => {
    this.handleEvent(evt);

    this.startInteraction();
  }

  onMouseUp = evt => {
    this.endInteraction(evt.target, evt);
  }

  startInteraction = () => {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.setState({ pressed: true });
        this.timer = undefined;
      }, this.props.pressDelay * asMilliseconds);
    }

    this.setState({ active: true });
  }

  endInteraction = (target, { pageX, pageY }) => {
    if (!this.state.active) {
      return;
    }

    const { pressed } = this.state;
    this.cancelTimeout();
    this.setState({
      pressed: false,
      active: false,
    });

    const bounds = target.getBoundingClientRect();

    if (!isWithinBounds(pageX, bounds.left, bounds.right) ||
        !isWithinBounds(pageY, bounds.top, bounds.bottom)) {
      return;
    }

    if (this.props.onTap) window.setTimeout(this.props.onTap, 0);
    if (pressed && this.props.onPress) window.setTimeout(this.props.onPress, 0);
  }

  render = () => {
    const { className } = this.props;

    const classes = classnames(className, {
      [className + '-inactive']: !this.state.active,
      [className + '-active']: this.state.active && !this.state.pressed,
      [className + '-pressed']: this.state.pressed,
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

  static propTypes() {
    return {
      onTap: PropTypes.func,
      onPress: PropTypes.func,
      pressDelay: PropTypes.number,
      className: PropTypes.string,
      children: PropTypes.object.isRequired,
    };
  }
}

export default Tappable;
