import * as actionTypes from "./actionTypes";
import API from "../../utils/apiRequests";
import { normalize } from "../utils/normalize";
import { addUserActivities, removeUserActivities } from "./user";
// import { createdActivityTemplate } from './activityTemplates';
import { clearLoadingInfo } from "./loading";
import { addCourseActivities, removeCourseActivities } from "./courses";

import * as loading from "./loading";

export const gotActivities = activities => ({
  type: actionTypes.GOT_ACTIVITIES,
  byId: activities.byId,
  allIds: activities.allIds
});

export const addActivity = activity => ({
  type: actionTypes.ADD_ACTIVITY,
  activity
});

export const updatedActivity = (id, body) => {
  return {
    type: actionTypes.UPDATED_ACTIVITY,
    id,
    body
  };
};

export const updatedActivityTab = (activityId, tabId, body) => {
  return {
    type: actionTypes.UPDATED_ACTIVITY_TAB,
    activityId,
    tabId,
    body
  };
};

export const setActivityStartingPoint = id => {
  return (dispatch, getState) => {
    let tabs = getState().activities.byId[id].tabs.map(tab => {
      tab.startingPoint = tab.currentState;
      tab.currentState = tab.currentState;
      tab.events = [];
      return tab;
    });
    dispatch(updatedActivity(id, { tabs }));
    Promise.all(
      tabs.map(tab =>
        API.put("tabs", tab._id, {
          events: [],
          startingPoint: tab.startingPoint,
          currentState: tab.currentState
        })
      )
    )
      .then(res => {
        return;
      })
      .catch(err => console.log("ER w THT: ", err));
  };
};

export const clearCurrentActivity = () => {
  return {
    type: actionTypes.CLEAR_ACTIVITY
  };
};

export const createdActivity = resp => {
  const newActivity = resp;
  return {
    type: actionTypes.CREATED_ACTIVITY,
    newActivity
  };
};

export const addActivityRooms = (activityId, roomIdsArr) => {
  return {
    type: actionTypes.ADD_ACTIVITY_ROOMS,
    activityId,
    roomIdsArr
  };
};

export const activitiesRemoved = activityIds => {
  return {
    type: actionTypes.REMOVE_ACTIVITIES,
    activityIds
  };
};

export const getActivities = params => {
  return dispatch => {
    dispatch(loading.start());
    API.get("activities", params)
      .then(res => {
        // Normalize res
        const activities = normalize(res.data.results);
        dispatch(gotActivities(activities));
        dispatch(loading.success());
      })
      .catch(err => {
        dispatch(loading.fail());
        console.log(err);
      });
  };
};

export const getCurrentActivity = id => {
  return dispatch => {
    dispatch(loading.start());
    API.getById("activities", id)
      .then(res => {
        dispatch(loading.success());
        dispatch(addActivity(res.data.result));
      })
      .catch(err => {
        dispatch(loading.fail());
        console.log(err);
      });
  };
};

export const createActivity = body => {
  return dispatch => {
    dispatch(loading.start());
    API.post("activities", body)
      .then(res => {
        let result = res.data.result;
        dispatch(createdActivity(result));
        if (body.course) {
          dispatch(addCourseActivities(body.course, [result._id]));
        }
        dispatch(addUserActivities([result._id]));
        return dispatch(loading.success());
      })
      .catch(err => {
        dispatch(loading.fail());
      });
  };
};

export const updateActivityTab = (activityId, tabId, body) => {
  return dispatch => {
    dispatch(updatedActivityTab(activityId, tabId, body));
    API.put("tabs", tabId, body)
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  };
};

export const copyActivity = (activityId, userId, courseId) => {
  return (dispatch, getState) => {
    let activity = { ...getState().activities.byId[activityId] };
    activity.source = activity._id;
    delete activity._id;
    delete activity.rooms;
    delete activity.course;
    activity.creator = userId;
    activity.course = courseId;
    dispatch(createActivity(activity));
  };
};

// @TODO MAKE SURE ONLY CREATOR CAN REMOVE
export const removeActivity = activityId => {
  return dispatch => {
    dispatch(loading.start());
    API.remove("activities", activityId)
      .then(res => {
        dispatch(removeUserActivities([activityId]));
        dispatch(removeCourseActivities(res.data.result.course, [activityId]));
        dispatch(activitiesRemoved([activityId]));
        dispatch(loading.success());
      })
      .catch(err => dispatch(loading.fail(err.response.data.errorMessage)));
  };
};

export const updateActivity = (id, body) => {
  return (dispatch, getState) => {
    let activity = { ...getState().activities.byId[id] };
    if (body.isTrashed) {
      dispatch(removeUserActivities([id]));
      dispatch(activitiesRemoved([id]));
    } else {
      dispatch(updatedActivity(id, body)); // THIS ONE's OPTIMISITC
    }
    // dispatch(loading.start())
    API.put("activities", id, body)
      .then(res => {
        // dispatch(loading.success())
        return;
      })
      .catch(err => {
        // Undo changes
        let keys = Object.keys(body);
        if (body.isTrashed) {
          dispatch(createdActivity(activity));
          if (activity.course) {
            dispatch(addCourseActivities(activity.course, [activity._id]));
          }
          dispatch(addUserActivities([activity._id]));
        } else {
          let prevActivity = {};
          keys.forEach(key => {
            prevActivity[key] = activity[key];
          });
          dispatch(updatedActivity(id, prevActivity));
        }
        dispatch(loading.updateFail("activity", keys));
        setTimeout(() => {
          dispatch(clearLoadingInfo());
        }, 2000);
      });
  };
};

export const createdActivityConfirmed = () => {
  return {
    type: actionTypes.CREATE_ACTIVITY_CONFIRMED
  };
};
