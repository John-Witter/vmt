import { combineReducers } from 'redux';
import user from './userReducer';
import rooms from './roomsReducer';
import courses from './coursesReducer';
import activities from './activitiesReducer';
import loading from './loadingReducer';

const rootReducer = combineReducers({
  user,
  loading,
  courses,
  activities,
  rooms,
});

export default rootReducer;

// Selector functions (prepare Data for the UI)
export const getUserResources = (state, resource) => {
  if (state[resource].allIds && state[resource].allIds.length > 0) {
    return state.user[resource].reduce((acc, cur) => {
      // Only get resources that are stand alone (i.e. not belonging to a course)
      const popRec = state[resource].byId[cur];
      if (
        resource === 'courses' ||
        (resource !== 'courses' && popRec && !popRec.course)
      ) {
        acc.push(popRec);
      }
      return acc;
    }, []);
  }
  return undefined;
};

// store, activities, activity_id, rooms
export const populateResource = (
  state,
  resourceToPop,
  resourceId,
  resources
) => {
  const currentResource = { ...state[resourceToPop].byId[resourceId] };
  if (!Object.keys(currentResource).length) return null;
  resources.forEach((resource) => {
    let populatedResources;
    if (currentResource && currentResource[resource]) {
      populatedResources = currentResource[resource]
        .filter((id) => {
          return state[resource].byId[id] || null;
        })
        .map((id) => {
          return state[resource].byId[id];
        });
    }
    currentResource[resource] = populatedResources;
  });
  return currentResource;
};

export const getAllUsersInStore = (state, usersToExclude) => {
  const userIds = new Set();
  const usernames = new Set();
  state.courses.allIds.forEach((id) => {
    state.courses.byId[id].members.forEach((member) => {
      if (usersToExclude.indexOf(member.user._id) === -1) {
        userIds.add(member.user._id);
        usernames.add(member.user.username);
      }
    });
  });
  state.rooms.allIds.forEach((id) => {
    state.rooms.byId[id].members.forEach((member) => {
      if (usersToExclude.indexOf(member.user._id) === -1) {
        userIds.add(member.user._id);
        usernames.add(member.user.username);
      }
    });
  });
  return { userIds, usernames };
};
