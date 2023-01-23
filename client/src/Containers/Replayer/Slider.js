import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import classes from './slider.css';
import EventDesc from './EventDesc/EventDesc';

class Slider extends Component {
  state = {
    dragging: false,
    sliderWidth: 0,
  };

  slider = React.createRef();

  componentDidMount() {
    this.getSliderWidth();
    window.addEventListener('resize', this.getSliderWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getSliderWidth);
  }

  getSliderWidth = () => {
    this.setState({
      sliderWidth: this.slider.current.getBoundingClientRect().width,
    });
  };

  jumpToPosition = (event) => {
    const { goToTime } = this.props;
    const { dragging } = this.state;
    // if (this.state.dragging) {
    //   event.preventDefault();
    // }
    if (!dragging) {
      const sliderEl = this.slider.current.getBoundingClientRect();
      const percent = (event.clientX - sliderEl.left) / sliderEl.width; // As a fraction
      goToTime(percent);
    }
  };

  startDrag = () => {
    this.setState({ dragging: true });
  };

  // @TODO consider throttling this
  onDrag = (e) => {
    const { goToTime } = this.props;
    const sliderEl = this.slider.current.getBoundingClientRect();
    let percent = (e.clientX - sliderEl.left) / sliderEl.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    goToTime(percent);
    this.setState({ dragging: false });
  };

  stopDrag = (e) => {
    const { goToTime } = this.props;
    const sliderEl = this.slider.current.getBoundingClientRect();
    let percent = (e.clientX - sliderEl.left) / sliderEl.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    goToTime(percent);
    this.setState({ dragging: false });
  };

  showEventDetail = (event) => {
    const { dragging } = this.state;
    if (!dragging) {
      event.target.children.style = { display: 'flex' };
    }
  };

  render() {
    const { log, duration, progress } = this.props;
    const { dragging, sliderWidth } = this.state;
    const eventMarks = log.map((entry) => {
      const color = entry.synthetic ? 'red' : entry.color;
      const percentFromStart = (entry.relTime / duration) * 100;
      return (
        <EventDesc
          key={entry._id}
          color={color}
          offset={percentFromStart}
          entry={entry}
          dragging={dragging}
        />
      );
    });
    const x =
      (progress / 100) * (sliderWidth - 6) > sliderWidth - 6
        ? sliderWidth - 6
        : (progress / 100) * (sliderWidth - 6);
    return (
      <div
        ref={this.slider}
        className={classes.Slider}
        onClick={this.jumpToPosition}
        onKeyPress={this.jumpToPosition}
        tabIndex="-2"
        role="button"
      >
        {eventMarks}
        <Draggable
          axis="x"
          bounds="parent"
          onStart={this.startDrag}
          onDrag={this.onDrag}
          onStop={this.stopDrag}
          position={{ x, y: 0 }}
        >
          <div ref={this.slider} className={classes.ProgressMarker} />
        </Draggable>
      </div>
    );
  }
}

Slider.propTypes = {
  progress: PropTypes.number.isRequired,
  log: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  duration: PropTypes.number.isRequired,
  goToTime: PropTypes.func.isRequired,
};

export default Slider;
