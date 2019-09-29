import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';
import classes from '../Workspace/graph.css';

import {
  getEventLabel,
  getEventType,
  getEventXml,
  setEventXml,
  setEventType,
} from './SharedReplayer.utils';

class GgbReplayer extends Component {
  graph = React.createRef();
  isFileSet = false; // calling ggb.setBase64 triggers this.initializeGgb(), because we set base 64 inside initializeGgb we use this instance var to track whether we've already set the file. When the ggb tries to load the file twice it breaks everything
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.inView) {
  //     return this.props.index !== nextProps.index;
  //   } else return false;
  // }

  componentDidUpdate(prevProps) {
    const { inView, log, index, changingIndex, isFullscreen } = this.props;
    if (!prevProps.inView && inView) {
      this.updateDimensions();
    }
    if (inView) {
      if (changingIndex && prevProps.index !== index) {
        this.applyMultipleEvents(prevProps.index, index);
      } else if (
        prevProps.index !== index &&
        (getEventXml(log[index]) || log[index].eventArray)
      ) {
        // check if the tab has changed
        this.constructEvent(log[index]);
      }

      // IF we're skipping it means we might need to reconstruct several evenets, possible in reverse order if the prevIndex is greater than this index.
      // This is a god damned mess...good luck
    }
    if (prevProps.isFullscreen && !isFullscreen) {
      this.updateDimensions();
    }
    // else if (!this.state.loading || this.state.tabStates !== prevState.tabStates){
    //   console.log('the tabState have changed')
    //   this.constructEvent(log[index])
    // }
    if (this.ggbApplet && prevProps.log !== log) {
      this.onScriptLoad();
    }
  }

  componentWillUnmount() {
    const { tabId } = this.props;
    window.removeEventListener('resize', this.updateDimensions);
    delete window[`ggbApplet${tabId}A`];
  }

  // We should periodically save the entire state so if we skip to the very end we don't have to apply each event one at a time

  constructEvent = (data) => {
    const eventType = getEventType(data);
    switch (eventType) {
      case 'ADD':
        if (data.undoRemove) {
          if (data.undoXML) {
            this.ggbApplet.evalXML(data.undoXML);
            this.ggbApplet.evalCommand('UpdateConstruction()');
          }
          if (data.undoArray) {
            this.recursiveUpdate(data.undoArray, true);
          }
        } else if (data.definition) {
          this.ggbApplet.evalCommand(`${data.label}:${data.definition}`);
        } else if (data.ggbEvent && data.ggbEvent.commandString) {
          // not sure if this is correct...
          this.ggbApplet.evalCommand(data.ggbEvent.commandString);
        }
        this.ggbApplet.evalXML(getEventXml(data));
        this.ggbApplet.evalCommand('UpdateConstruction()');
        break;
      case 'REMOVE':
        if (data.eventArray && data.eventArray.length > 1) {
          data.eventArray.forEach((labelOrGgbEvent) => {
            if (typeof labelOrGgbEvent === 'string') {
              this.ggbApplet.deleteObject(labelOrGgbEvent);
            } else {
              this.ggbApplet.deleteObject(labelOrGgbEvent.label);
            }
          });
        } else {
          this.ggbApplet.deleteObject(getEventLabel(data));
        }
        break;
      case 'UPDATE':
        this.ggbApplet.evalXML(getEventXml(data));
        this.ggbApplet.evalCommand('UpdateConstruction()');
        break;
      case 'CHANGE_PERSPECTIVE':
        this.ggbApplet.setPerspective(getEventXml(data));
        this.ggbApplet.showAlgebraInput(true);
        // this.ggbApplet.evalXML(data.event);
        // this.ggbApplet.evalCommand("UpdateConstruction()");
        break;
      case 'BATCH_UPDATE':
        // make a copy because we're going to mutate the array so we
        // know when to stop the recursive process
        this.recursiveUpdate([...data.eventArray], false);
        break;
      case 'BATCH_ADD':
        if (data.definition) {
          // this.ggbApplet.evalCommand(data.event);
          this.recursiveUpdate(data.eventArray, true);
        } else if (data.ggbEvent && data.ggbEvent.commandString) {
          this.recursiveUpdate(data.eventArray, true);
        }
        break;
      case 'BATCH_REMOVE':
        data.eventArray.forEach((labelOrGgbEvent) => {
          if (typeof labelOrGgbEvent === 'string') {
            this.ggbApplet.deleteObject(labelOrGgbEvent);
          } else {
            this.ggbApplet.deleteObject(labelOrGgbEvent.label);
          }
        });
        break;
      case 'UPDATE_STYLE': {
        if (data.eventArray) {
          this.recursiveUpdate(data.eventArray);
        }
        break;
      }
      default:
        break;
    }
  };

  onScriptLoad = () => {
    const { tab, tabId } = this.props;
    const parameters = {
      id: `ggbApplet${tabId}A`, // THE 'A' here is because ggb doesn't like us ending Id name with a number
      // "width": 1300 * .75, // 75% width of container
      // "height": GRAPH_HEIGHT,
      // "scaleContainerClass": "graph",
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: true,
      language: 'en',
      useBrowserForJS: true,
      borderColor: '#ddd',
      errorDialogsActive: false,
      preventFocus: true,
      appletOnLoad: this.initializeGgb,
      appName: tab.appName,
    };
    const ggbApp = new window.GGBApplet(parameters, '5.0');
    ggbApp.inject(`ggb-element${tabId}A`);
  };

  initializeGgb = () => {
    const { tabId, tab, setTabLoaded } = this.props;
    this.ggbApplet = window[`ggbApplet${tabId}A`];
    setTabLoaded(tab._id);
    this.ggbApplet.setMode(40); // Sets the tool to zoom
    const { startingPoint, ggbFile } = tab;
    // put the current construction on the graph, disable everything until the user takes control
    // if (perspective) this.ggbApplet.setPerspective(perspective);
    if (startingPoint) {
      this.ggbApplet.setXML(startingPoint);
    } else if (ggbFile && !this.isFileSet) {
      this.isFileSet = true;
      this.ggbApplet.setBase64(ggbFile);
    }
  };

  updateDimensions = () => {
    const { tabId } = this.props;
    // this.resizeTimer = setTimeout(() => {
    if (this.graph.current) {
      const { clientHeight, clientWidth } = this.graph.current.parentElement;
      window[`ggbApplet${tabId}A`].setSize(clientWidth, clientHeight);
    }
  };

  /**
   * @method recursiveUpdate
   * @description takes an array of events and updates the construction in batches
   * used to make drag updates and multipoint shape creation more efficient. See ./docs/Geogebra
   * Note that this is copy-pasted in GgbReplayer for now, consider abstracting
   * @param  {Array} events - array of ggb xml events
   * @param  {Number} batchSize - the batch size, i.e., number of points in the shape
   * @param  {Boolean} adding - true if BATCH_ADD false if BATCH_UPDATE
   */

  recursiveUpdate(events, adding) {
    if (events && events.length > 0) {
      if (adding) {
        for (let i = 0; i < events.length; i++) {
          this.ggbApplet.evalCommand(events[i]);
        }
      } else {
        // @todo skip more events depending on playback speed.
        if (events.length > 10) {
          events.splice(0, 2);
        }
        this.ggbApplet.evalXML(events.shift());
        this.ggbApplet.evalCommand('UpdateConstruction()');
        setTimeout(() => {
          this.recursiveUpdate(events, false);
        }, 10);
      }
    }
  }

  /**
   * @method applyMultipleEvents
   * @description Takes two indices from the log and applies (or un-applies if going backwards thru time) all events between
   * @param  {} startIndex
   * @param  {} endIndex
   */

  applyMultipleEvents(startIndex, endIndex) {
    const { log } = this.props;
    // Forwards through time
    if (startIndex < endIndex) {
      // this.ggbApplet.setXML(this.props.log[endIndex].currentState);
      for (let i = startIndex; i <= endIndex; i++) {
        if (
          log[i].eventArray &&
          log[i].eventArray.length > 0 &&
          getEventType(log[i]) === 'BATCH_UPDATE'
        ) {
          const syntheticEvent = { ...log[i] };
          const { eventArray } = syntheticEvent;

          const xmlOrGgbEvent = eventArray.pop();

          setEventXml(syntheticEvent, xmlOrGgbEvent);
          setEventType(syntheticEvent, 'UPDATE');

          this.constructEvent(syntheticEvent);
        } else {
          this.constructEvent(log[i]);
        }
      }
    }

    // backwards through time
    else {
      for (let i = startIndex; i > endIndex; i--) {
        const syntheticEvent = { ...log[i] };
        const eventType = getEventType(syntheticEvent);

        if (eventType === 'ADD') {
          setEventType(syntheticEvent, 'REMOVE');
        } else if (eventType === 'REMOVE') {
          syntheticEvent.undoRemove = true;
          setEventType(syntheticEvent, 'ADD');
        } else if (eventType === 'BATCH_ADD') {
          setEventType(syntheticEvent, 'BATCH_REMOVE');
        } else if (eventType === 'BATCH_UPDATE') {
          const { eventArray } = { ...syntheticEvent };

          const xmlOrGgbEvent = eventArray.shift();

          setEventXml(syntheticEvent, xmlOrGgbEvent);
          setEventType(syntheticEvent, 'UPDATE');
        }
        this.constructEvent(syntheticEvent);
      }
    }
  }

  render() {
    const { tabId } = this.props;
    return (
      <Fragment>
        <Script
          url="https://cdn.geogebra.org/apps/deployggb.js"
          onLoad={this.onScriptLoad}
        />
        <div
          className={classes.Graph}
          id={`ggb-element${tabId}A`}
          ref={this.graph}
        />
      </Fragment>
    );
  }
}

GgbReplayer.propTypes = {
  log: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  changingIndex: PropTypes.bool.isRequired,
  inView: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  setTabLoaded: PropTypes.func.isRequired,
  tab: PropTypes.shape({
    appName: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    startinPoint: PropTypes.string,
    ggbFile: PropTypes.string,
  }).isRequired,
  tabId: PropTypes.number.isRequired,
};

export default GgbReplayer;
