// THIS DOESN"T FEEL LIKE ITS IN A VERY LOGICAL PLACE IN THE FILE STRUCUTRE

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Aux, Button, Modal, EditText, Error } from '../../../Components';
import MakeRooms from '../../../Containers/Create/MakeRooms/MakeRooms';
import classes from './activityDetails.css';
class ActivityDetails extends Component {
  state = {
    assigning: false,
  }

  viewActivity = () => {
    this.props.history.push(`/myVMT/workspace/${this.props.activity._id}/activity`)
  }

  render() {
    const {
      activity,
      course,
      // editing,
      // toggleEdit,
      owner,
      loading
    } = this.props;
    return (
      <Aux>
        <div>
            <div className={classes.Instructions}>
              <p className={classes.InstructionsHeader}>Instructions:</p>
                <Error error={loading.updateFail && loading.updateKeys.indexOf('instructions') > -1}><EditText inputType='text-area' name='instructions' change={this.props.update} editing={this.props.editing}>
                  {this.props.instructions}
                </EditText></Error>
            </div>
          {owner
            ? <div>
                <Button m={5} click={this.viewActivity}>View/Edit Activity</Button>
                <Button m={5} click={() => {this.setState({assigning: true})}} data-testid='assign'>Assign Activity</Button>
              </div>
            : null
          }
        </div>
        {this.state.assigning ? <Modal show={true} closeModal={() => {this.setState({assigning: false})}}>
          <MakeRooms
            activity={activity}
            course={course ? course._id : null}
            userId={this.props.userId}
            close={() => {this.setState({assigning: false})}}
            participants={course ? course.members.filter(member => member.role === 'participant') : []}/>
        </Modal> : null}
      </Aux>
    )
  }
}

export default withRouter(ActivityDetails);
