import React from 'react';
import PropTypes from 'prop-types';
import Awareness from './Awareness';
import Slider from '../../../Components/UI/Button/Slider';
import Button from '../../../Components/UI/Button/Button';
import classes from './tools.css';

const Tools = ({
  inControl,
  lastEvent,
  replayer,
  save,
  referencing,
  goBack,
  toggleControl,
  clearReference,
  startNewReference,
}) => {
  let controlText;
  if (!replayer) {
    controlText = 'Request Control';
    if (inControl === 'ME') {
      controlText = 'Release Control';
    } else if (inControl === 'NONE') {
      controlText = 'Take Control';
    }
  }
  return (
    <div className={classes.Container}>
      {/* <h3 className={classes.Title}>Tools</h3> */}
      <div className={classes.Expanded}>
        <div className={classes.Controls}>
          {!replayer ? (
            <Button theme="xs" data-testid="take-control" click={toggleControl}>
              {controlText}
            </Button>
          ) : // <div
          //   className={classes.SideButton}
          //   role="button"
          //   data-testid="take-control"
          //   onClick={toggleControl}
          //   onKeyPress={toggleControl}
          //   tabIndex="-1"
          // >
          //   {controlText}
          // </div>
          null}
          <Button theme="xs-cancel" click={goBack} data-testid="exit-room">
            Exit {replayer ? 'Replayer' : 'Room'}
          </Button>
          {/* <div
            className={classes.Exit}
            role="button"
            onClick={goBack}
            onKeyPress={goBack}
            tabIndex="-2"
            // theme={"Small"}
            data-testid="exit-room"
          >
            Exit {replayer ? 'Replayer' : 'Room'}
          </div> */}
        </div>
        {save ? (
          <div className={classes.Save}>
            <div
              className={classes.SideButton}
              role="button"
              data-testid="save"
              onClick={save}
              onKeyPress={save}
              tabIndex="-3"
            >
              save
            </div>
          </div>
        ) : null}
        {!replayer ? (
          <div
            className={
              referencing
                ? classes.ActiveReferenceWindow
                : classes.ReferenceWindow
            }
          >
            Referencing
            <Slider
              data-testid="new-reference"
              onClick={referencing ? clearReference : startNewReference}
              isOn={referencing}
            />
          </div>
        ) : null}

        <div>
          <Awareness lastEvent={lastEvent} />
        </div>
      </div>
    </div>
  );
};

Tools.propTypes = {
  inControl: PropTypes.string,
  lastEvent: PropTypes.shape({}),
  replayer: PropTypes.bool,
  save: PropTypes.func,
  referencing: PropTypes.bool,
  goBack: PropTypes.func.isRequired,
  toggleControl: PropTypes.func,
  clearReference: PropTypes.func,
  startNewReference: PropTypes.func,
};

Tools.defaultProps = {
  toggleControl: null,
  referencing: false,
  clearReference: null,
  startNewReference: null,
  lastEvent: null,
  inControl: null,
  replayer: false,
  save: null,
};

export default Tools;
