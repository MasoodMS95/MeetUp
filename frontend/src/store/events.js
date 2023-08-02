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
    dispatch(getAllEventsAction(events.Events));
    return events;
  }
  return await res.json();
}

export const getSingleEvent = (eventId) => async (dispatch) =>{
  const res = await csrfFetch(`api/events/${eventId}`);
  if(res.ok){
    let event = await res.json();
    dispatch(getSingleEventAction(event));
    return event;
  }
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
