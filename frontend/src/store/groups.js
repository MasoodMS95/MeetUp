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
