import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const GET_ALL_GROUPS = 'groups/GET_ALL';
export const GET_SINGLE_GROUP = 'groups/';

/**  Action Creators: */
export const getAllGroupsAction = (groups) => ({
  type: GET_ALL_GROUPS,
  groups
})

export const getSingleGroupAction = (group) => ({
  type: GET_SINGLE_GROUP,
  group
})

/** Thunk Action Creators: */
export const getAllGroups = () => async (dispatch) =>{
  const res = await csrfFetch('/api/groups');
  if(res.ok){
    let groups = await res.json();
    dispatch(getAllGroupsAction(groups.Groups));
    return groups;
  }
  return await res.json();
}

export const getSingleGroup = (groupId) => async (dispatch) =>{
  const res = await csrfFetch(`/api/groups/${groupId}`);
  if(res.ok){
    let group = await res.json();
    dispatch(getSingleGroupAction(group));
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
  dispatch(getAllGroups())
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
  await dispatch(getAllGroups())
  return res.json();
}

//Reducer
const groupReducer = (state = {allGroups: {}, singleGroup:{}}, action) => {
  switch (action.type) {
    case GET_ALL_GROUPS:
      const allGroupsState = {...state};
      action.groups.forEach(group => {
        allGroupsState.allGroups[group.id] = group;
      });
      return allGroupsState
    case GET_SINGLE_GROUP:
      const singleGroupState = {...state};
      singleGroupState.singleGroup = action.group;
      return singleGroupState;
    default:
      return state;
  }
};

export default groupReducer;
