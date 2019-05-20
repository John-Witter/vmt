import React from 'react';
import Awareness from './Awareness';
import classes from './tools.css';

const Tools = React.memo(props => {
  let { inControl, lastEvent, replayer, save } = props;
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
      <div className={true ? classes.Expanded : classes.Collapsed}>
        <div className={classes.Controls}>
          {!replayer ? (
            <div
              className={classes.SideButton}
              role="button"
              data-testid="take-control"
              onClick={props.toggleControl}
            >
              {controlText}
            </div>
          ) : null}
          <div
            className={classes.Exit}
            role="button"
            onClick={props.goBack}
            // theme={"Small"}
            data-testid="exit-room"
          >
            Exit {replayer ? 'Replayer' : 'Room'}
          </div>
        </div>
        {props.save ? (
          <div className={classes.Save}>
            <div
              className={classes.SideButton}
              role="button"
              data-testid="save"
              onClick={props.save}
            >
              save
            </div>
          </div>
        ) : null}
        <div className={classes.ReferenceWindow}>
          {!replayer ? (
            <div
              className={classes.ReferenceControls}
              onClick={
                props.referencing
                  ? props.clearReference
                  : props.startNewReference
              }
            >
              <i
                className={[
                  'fas',
                  'fa-mouse-pointer',
                  classes.MousePointer,
                  props.referencing ? classes.ReferencingActive : '',
                ].join(' ')}
              />
              <div className={classes.ReferenceTool}>Reference</div>
              {/* <div className={classes.RefrenceTool}>Perspective</div> */}
            </div>
          ) : null}
        </div>
        <div>
          <Awareness lastEvent={lastEvent} />
        </div>
      </div>
    </div>
  );
});

export default Tools;
