/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { dateAndTime } from 'utils';
import classes from './timeline.css';
import Button from '../UI/Button/Button';

const Timeline = ({
  startTime,
  endTime,
  currentStartTime,
  currentEndTime,
  dispatch,
}) => {
  const selectDate = (date, id) => {
    let unixDate = dateAndTime.getTimestamp(date);
    if (unixDate < startTime) {
      unixDate = startTime;
    } else if (unixDate > endTime) {
      unixDate = endTime;
    }
    dispatch({ type: 'UPDATE_TIME', payload: { id, time: unixDate } });
  };
  return (
    <div className={classes.Timeline}>
      <DatePicker
        selected={new Date(currentStartTime)}
        onChange={(date) => selectDate(date, 'start')}
        popperPlacement="top-start"
        shouldCloseOnSelect
        showTimeSelect
        timeIntervals={1}
        dateFormat="Pp"
      />
      <DatePicker
        selected={new Date(currentEndTime)}
        onChange={(date) => selectDate(date, 'end')}
        popperPlacement="top-start"
        shouldCloseOnSelect
        showTimeSelect
        timeIntervals={1}
        dateFormat="Pp"
      />
      <Button
        type="button"
        click={() => dispatch({ type: 'UPDATE_TIME', payload: { id: 'both' } })}
      >
        reset
      </Button>
    </div>
  );
};

Timeline.propTypes = {
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  currentStartTime: PropTypes.number.isRequired,
  currentEndTime: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  // startDateF: PropTypes.string.isRequired,
  // endDateF: PropTypes.string.isRequired,
  // dispatch: PropTypes.func.isRequired,
  // progress: PropTypes.number.isRequired,
  // log: PropTypes.arrayOf(PropTypes.object).isRequired,
  // durationDisplay: PropTypes.number.isRequired,
  // goToTime: PropTypes.func.isRequired,
};

export default Timeline;
