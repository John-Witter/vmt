import React from 'react';
import classes from './tools.css';

const Tools = React.memo((props) => {
  let controlText = "Request Control";
  if (props.inControl === 'ME') {
    controlText = 'Release Control';
  } else if (props.inControl === 'NONE') {
    controlText = 'Take Control';
  }
  return (
    <div className={classes.Container}>
      <h3 className={classes.Title}>Tools</h3>
      <div className={(true ? classes.Expanded : classes.Collapsed)} data-testid='current-members'>
           <div className={classes.ReferenceWindow}>
            <div className={classes.ReferenceControls} onClick={props.referencing ? props.clearReference : props.startNewReference}>
              <i className={["fas", "fa-mouse-pointer", classes.MousePointer, props.referencing ? classes.ReferencingActive : ''].join(" ")}></i>
              <div className={classes.ReferenceTool}>Reference</div>
              {/* <div className={classes.RefrenceTool}>Perspective</div> */}
            </div>
            <div className={classes.Controls}>
              <div className={classes.SideButton} onClick={props.toggleControl}>{controlText}</div>
              <div className={[classes.SideButton, classes.Exit].join(" ")} onClick={props.goBack} theme={'Small'} data-testid='exit-room'>Exit Room</div>
            </div>
          </div>
      </div>
    </div>
  )
})

export default Tools;