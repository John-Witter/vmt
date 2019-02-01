import React, { Component } from 'react';
import { TextInput, RadioBtn, Button } from '../../Components';
import classes from './graph.css';
import API from '../../utils/apiRequests';
class NewTabForm extends Component {

  state = {
    name: '',
    instructions: '',
    tabType: '',
    ggbFile: '',
    desmosLink: '',
    ggb: true,
  }

  changeHandler = (event) => {
    this.setState(
      {[event.target.name]: event.target.value,
        errorMessage: null,
      }
    )
  }

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.submit();
    }
  }
    // @TODO move this somewhere it can be shared with Containsers/Workspace/NewTabForm
  // maybe it makes sense to move newTabForm Here because its creating something
  uploadGgbFiles = () => {
    let files = this.state.ggbFile;
    if (typeof files !== 'object' || files.length < 1)  {
      return Promise.resolve({
        data: {
          result: []
        }
      });
    }
    let formData = new FormData();

    for (let f of files) {
      formData.append('ggbFiles', f);
    }
    return API.uploadGgbFiles(formData)
  }

  submit = () => {
    let updatedName = this.state.name;
    if (updatedName.trim().length <= 1) {
      this.setState({
        errorMessage: 'Please provide a name for the tab'
      })
      return;
    }
    let newTab = {
      name: this.state.name,
      instructions: this.state.instructions,
      tabType: this.state.ggb ? 'geogebra' : 'desmos',
      desmosLink: this.state.desmosLink,
      room: this.props.room ? this.props.room._id : null,
      activity: this.props.activity ? this.props.activity._id : null,
    }
    this.uploadGgbFiles()
    .then(results => {
      if (results && results.data) {
        newTab.ggbFile = results.data.result[0];
      }
      return API.post('tabs', newTab)
    })
    .then(res => {
      let tabs;
      if (this.props.room) {
        tabs = [...this.props.room.tabs];
        tabs.push(res.data.result)
        this.props.updatedRoom(this.props.room._id, {tabs,})
      } else {
        tabs = [...this.props.activity.tabs]
        tabs.push(res.data.result)
        // UPDATE REDUX ACTIVITY
        this.props.updatedActivity(this.props.activity._id, {tabs,})
      }
      this.props.closeModal();
    })
    .catch(err => {
      // DISPLAY THIS ERROR MESSAGE: @TODO
    })
  }

  setGgbFile = event => {
    this.setState({
      ggbFile: event.target.files
    })
  }

  render(){
    return (
      <div className={classes.NewTabModal}>
        <h2>Create A New Tab</h2>
        <TextInput light value={this.state.name} change={this.changeHandler} onKeyDown={this.onKeyDown} name='name' label='Name' autofill='none'/>
          {this.state.errorMessage ? <div className={classes.ErrorMessage}>{this.state.errorMessage}</div> : null}
        <TextInput light value={this.state.instructions} change={this.changeHandler} onKeyDown={this.onKeyDown} name='instructions' label='Instructions'/>
        <div className={classes.RadioGroup}>
          <RadioBtn name='geogebra' checked={this.state.ggb} check={() => this.setState({ggb: true})}>GeoGebra</RadioBtn>
          <RadioBtn name='desmos' checked={!this.state.ggb} check={() => this.setState({ggb: false})}>Desmos</RadioBtn>
        </div>
        <div className={classes.ImportOption}>
          {this.state.ggb ?
          <div>
            <div className={classes.Info}>Import a GeoGebra (optional)</div>
            <input type="file" id='file' multiple={false} name='ggbFile' accept='.ggb' onChange={this.setGgbFile}>
            </input>
          </div> :
          <TextInput
            light
            name='desmosLink'
            label='Paste a Desmos workspace'
            change={this.changeHandler}
          />}
        </div>
        <Button m={10} click={this.submit}>Create</Button>
      </div>
    )
  }
}
export default NewTabForm;
