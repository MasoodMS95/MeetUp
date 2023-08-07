import { csrfFetch } from "./csrf";
const clone = require('clone-deep');

/** Action Type Constants: */
export const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';
export const GET_SINGLE_EVENT = 'events/GET_SINGLE_EVENT';
export const DELETE_EVENT = 'events/DELETE_ALL_EVENTS';

/**  Action Creators: */
export const getAllEventsAction = (events) => ({
  type: GET_ALL_EVENTS,
  events
})

export const getSingleEventAction = (event) => ({
  type: GET_SINGLE_EVENT,
  event
})

export const deleteEventAction = (eventId) => ({
  type: DELETE_EVENT,
  eventId
})

/** Thunk Action Creators: */
export const getAllEvents = () => async (dispatch) =>{
  const res = await csrfFetch('/api/events');
  if(res.ok){
    let events = await res.json();
    await dispatch(getAllEventsAction(events.Events));
    return events;
  }
  return await res.json();
}

export const getSingleEvent = (eventId) => async (dispatch) =>{
  const res = await csrfFetch(`/api/events/${eventId}`);
  if(res.ok){
    let event = await res.json();
    await dispatch(getSingleEventAction(event));
    return event;
  }
}

export const createEvent = (eventInfo, imgUrl, groupId) => async (dispatch) =>{
  let res;

  try{
    res = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: 'POST',
      body: JSON.stringify({...eventInfo, capacity:10})
    });
  }
  catch(err){
    const error = await err.json()
    return error;
  }
  //TO-DO: Make sure front end handles issues
  const parsedRes = await res.json();

  const eImgRes = await csrfFetch(`/api/events/${parsedRes.id}/images`,{
    method: 'POST',
    body: JSON.stringify({url: imgUrl, preview:true})
  })
  await dispatch(getAllEvents());
  return parsedRes;
}

export const deleteEvent = (eventId) => async(dispatch) => {
  let res;
  try{
    res = await csrfFetch(`/api/events/${eventId}`, {
      method: 'DELETE'
    })
  }
  catch(err){
    const error = await err.json();
    return error;
  }
  await dispatch(deleteEventAction(eventId));
  return res.json();
}

//Reducer
const eventReducer = (state = {allEvents: {}, singleEvent:{}}, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      const newAllEventsState = clone(state);
      Object.keys(newAllEventsState.allEvents).forEach(key=>{
        delete newAllEventsState.allEvents[key]
      })
      action.events.forEach(event => {
        newAllEventsState.allEvents[event.id] = event;
      });
      return newAllEventsState
    case GET_SINGLE_EVENT:
      const newSingleEventState = clone(state);
      newSingleEventState.singleEvent = action.event;
      return newSingleEventState;
    case DELETE_EVENT:
      const newDeleteEventState = clone(state);
      delete newDeleteEventState.allEvents[action.eventId]
      return newDeleteEventState;
    default:
      return state;
  }
};

export default eventReducer;
