import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const GET_ALL_EVENTS = 'events/GET_ALL';
export const GET_SINGLE_EVENT = 'events/GET_SINGLE_EVENT';

/**  Action Creators: */
export const getAllEventsAction = (events) => ({
  type: GET_ALL_EVENTS,
  events
})

export const getSingleEventAction = (event) => ({
  type: GET_SINGLE_EVENT,
  event
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
    dispatch(getSingleEventAction(event));
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
  await dispatch(getAllEvents());
  return res.json();
}

//Reducer
const eventReducer = (state = {allEvents: {}, singleEvent:{}}, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      const allEventsState = {...state};
      action.events.forEach(event => {
        allEventsState.allEvents[event.id] = event;
      });
      return allEventsState
    case GET_SINGLE_EVENT:
      const singleEventState = {...state};
      singleEventState.singleEvent = action.event;
      return singleEventState;
    default:
      return state;
  }
};

export default eventReducer;
