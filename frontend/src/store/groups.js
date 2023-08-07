import { csrfFetch } from "./csrf";
const clone = require('clone-deep');


/** Action Type Constants: */
export const GET_ALL_GROUPS = 'groups/GET_ALL_GROUPS';
export const GET_SINGLE_GROUP = 'groups/GET_SINGLE_GROUP';
export const DELETE_GROUP = 'groups/DELETE_GROUP'

/**  Action Creators: */
export const getAllGroupsAction = (groups) => ({
  type: GET_ALL_GROUPS,
  groups
})

export const getSingleGroupAction = (group) => ({
  type: GET_SINGLE_GROUP,
  group
})

export const deleteGroupAction = (groupId) => ({
  type: DELETE_GROUP,
  groupId
})

/** Thunk Action Creators: */
export const getAllGroups = () => async (dispatch) =>{
  const res = await csrfFetch('/api/groups');
  if(res.ok){
    let groups = await res.json();
    await dispatch(getAllGroupsAction(groups.Groups));
    return groups;
  }
  return await res.json();
}

export const getSingleGroup = (groupId) => async (dispatch) =>{
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if(res.ok){
    let group = await res.json();
    await dispatch(getSingleGroupAction(group));
    return group;
  }
}

export const createGroup = (newGroup) => async (dispatch) => {
  const {name, about, type, privacy, city, state, imgURL} = newGroup;
  const body = {name, about, type, private:privacy, city, state};
  let res;
  try{
      res = await csrfFetch('/api/groups', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
  catch(err){
    const error = await err.json();
    return error
  }
  //TO-DO: Make sure front end handles issues
  const parsedRes = await res.json();
  const gImgRes = await csrfFetch(`/api/groups/${parsedRes.id}/images`, {
    method: 'POST',
    body: JSON.stringify({url: imgURL, preview:true})
  })
  await dispatch(getAllGroups())
  return parsedRes;
}

export const updateGroup = (updatedGroup, id) => async (dispatch) => {
  const {name, about, type, privacy, city, state} = updatedGroup;
  const body = {name, about, type, private:privacy?"true":"false", city, state};
  let res;
  try{
      res = await csrfFetch(`/api/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }
  catch(err){
    const error = await err.json();
    return error
  }
  return await res.json();
}

export const deleteGroup = (groupId) => async(dispatch) => {
  let res;
  try{
    res = await csrfFetch(`/api/groups/${groupId}`, {
      method: 'DELETE'
    })
  }
  catch(err){
    const error = await err.json();
    return error;
  }
  console.log(res);
  await dispatch(deleteGroupAction(groupId))
  return res.json();
}

//Reducer
const groupReducer = (state = {allGroups: {}, singleGroup:{}}, action) => {
  switch (action.type) {
    case GET_ALL_GROUPS:
      const newAllGroupState = clone(state);
      action.groups.forEach(group => {
        newAllGroupState.allGroups[group.id] = group;
      });
      return newAllGroupState;
    case GET_SINGLE_GROUP:
      const newSingleGroupState = clone(state);
      newSingleGroupState.singleGroup = action.group;
      return newSingleGroupState;
    case DELETE_GROUP:
      const newDeleteGroupState = clone(state);
      delete newDeleteGroupState.allGroups[action.groupId]
      return newDeleteGroupState;
    default:
      return state;
  }
};

export default groupReducer;
