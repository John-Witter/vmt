import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classes from './makeRooms.css';

const AssignmentMatrix = (props) => {
  const {
    allParticipants,
    requiredParticipants,
    roomDrafts,
    select, // should be 'setRoomDrafts'
    canDeleteRooms, // should be 'canAddDeleteRooms'
    userId,
    onAddParticipants,
  } = props;

  // =========== SORT FACILITATORS TO THE END OF ALL PARTICIPANTS ==============
  const sortAllParticipants = () => {
    const facilitators = allParticipants
      .filter((mem) => mem.role === 'facilitator')
      .sort((a, b) => (a.user.username < b.user.username ? -1 : 1));

    const participants = allParticipants.filter(
      (mem) => mem.role === 'participant'
    );

    const sorted = [...participants].concat([...facilitators]);
    return sorted;
  };

  // =========== HANDLE CHANGES IN NUMBER OF ROOMS ==============

  const deleteRoom = (index) => {
    if (roomDrafts.length <= 1) return;
    const roomList = [...roomDrafts];
    roomList.splice(index, 1);
    select(roomList);
  };

  const addRoom = (index) => {
    const roomList = [...roomDrafts];
    const newRoom = {
      members: [...requiredParticipants],
    };
    roomList.splice(index, 0, newRoom);
    select(roomList);
  };

  // ======================= HANDLE WHEN A PERSON GETS CLICKED (ASSIGNED TO A ROOM) ===========================

  const selectParticipant = (event, data) => {
    const { roomIndex } = data;
    const user = {
      role: data.participant.role || 'participant',
      _id: data.participant.user._id,
      user: data.participant.user,
    };

    if (user._id && roomIndex >= 0) {
      // create a deep copy of roomDrafts to avoid reference sharing
      const roomsUpdate = JSON.parse(JSON.stringify(roomDrafts));
      const index = checkUser(roomIndex, user);
      if (index < 0) {
        roomsUpdate[roomIndex].members.push({ ...user });
      }
      if (index >= 0) {
        roomsUpdate[roomIndex].members.splice(index, 1);
      }

      select(roomsUpdate);
    }
  };

  const checkUser = (roomIndex, user) => {
    return roomDrafts[roomIndex].members.findIndex(
      (mem) => mem.user._id === user._id
    );
  };

  // =========================================================

  return (
    <Fragment>
      <div className={classes.AssignmentMatrix}>
        <table className={classes.Table}>
          <caption className={classes.Caption}>Rooms</caption>
          <thead>
            <tr className={classes.LockedTop}>
              <th className={classes.LockedColumn}>
                Participants{' '}
                {onAddParticipants && (
                  <div
                    className={classes.AliasInstructions}
                    style={{ display: 'inline' }}
                  >
                    <i
                      className={`fas fa-solid fa-plus ${classes.plus}`}
                      onClick={() => {
                        onAddParticipants(true);
                      }}
                      onKeyDown={() => {
                        onAddParticipants(true);
                      }}
                      tabIndex={-1}
                      role="button"
                    >
                      <div className={classes.AliasTooltipContent}>
                        Add participants either individually or by adding an
                        entire course list
                      </div>
                    </i>
                  </div>
                )}
              </th>
              {roomDrafts.map((room, i) => {
                return (
                  <th
                    className={classes.RoomsList}
                    key={`room-${i + 1}`}
                    id={`room-${i}`}
                  >
                    {i + 1}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* top row rooms list */}
            {sortAllParticipants().map((participant, i) => {
              const isSelected = roomDrafts.some((room) =>
                room.members.find(
                  (mem) => mem.user._id === participant.user._id
                )
              );
              const isRequired = requiredParticipants.some(
                ({ user }) => user.username === participant.user.username
              );
              const rowClass = [
                classes.Participant,
                isRequired ? classes.Selected : '',
                isSelected ? classes.SelectionMade : '',
              ].join(' ');

              return (
                <tr
                  className={rowClass}
                  key={participant.user._id}
                  id={participant.user._id}
                >
                  <td className={classes.LockedColumn}>
                    {`${i + 1}. ${participant.user.username}`}
                  </td>
                  {roomDrafts.map((room, j) => {
                    const roomKey = `${participant.user._id}rm${j}`;
                    const data = {
                      roomKey,
                      participant,
                      roomIndex: j,
                    };
                    return (
                      <td
                        key={`${participant.user._id}rm${j + 1}`}
                        className={classes.CellAction}
                      >
                        <input
                          type="checkbox"
                          id={roomKey}
                          disabled={userId === participant.user._id}
                          data-testid={`checkbox${i + 1}-${j + 1}`}
                          onChange={(event) => {
                            selectParticipant(event, data);
                          }}
                          checked={checkUser(j, participant.user) >= 0}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {canDeleteRooms && (
              <tr className={`${classes.Participant} ${classes.LockedBottom}`}>
                <td key="room-delete-row" className={classes.LockedColumn}>
                  <span>Add / Delete</span>
                </td>
                {roomDrafts.map((room, i) => {
                  const index = i; // defeat the linter
                  return (
                    <td
                      key={`room-${index}-delete`}
                      className={classes.CellAction}
                    >
                      <i
                        className={`fas fa-solid fa-plus ${classes.plus}`}
                        id={`room-${i}-addBtn`}
                        disabled={roomDrafts.length >= allParticipants.length}
                        data-testid={`addRoom-${i + 1}`}
                        onClick={() => addRoom(i)}
                        onKeyDown={() => addRoom(i)}
                        tabIndex={-1}
                        role="button"
                      />
                      <i
                        className={`fas fa-solid fa-minus ${classes.minus}`}
                        id={`room-${i}-deleteBtn`}
                        disabled={roomDrafts.length <= 1}
                        data-testid={`deleteRoom-${i + 1}`}
                        onClick={() => deleteRoom(i)}
                        onKeyDown={() => deleteRoom(i)}
                        tabIndex={-1}
                        role="button"
                      />
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

AssignmentMatrix.propTypes = {
  allParticipants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  requiredParticipants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  select: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  roomDrafts: PropTypes.arrayOf(
    PropTypes.shape({ members: PropTypes.arrayOf(PropTypes.shape({})) })
  ).isRequired,
  canDeleteRooms: PropTypes.bool,
  onAddParticipants: PropTypes.func,
};

AssignmentMatrix.defaultProps = {
  canDeleteRooms: true,
  onAddParticipants: null,
};

export default AssignmentMatrix;
