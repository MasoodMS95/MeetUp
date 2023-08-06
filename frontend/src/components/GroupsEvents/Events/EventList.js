import { useDispatch, useSelector } from 'react-redux';

import '../../../css/GroupsEvents/GroupEventLists.css'
import EventListItem from './EventListItem';
import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../../../store/events';

function EventList(){
  const events = useSelector(state => state.events.allEvents);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchEvents = async () => {
      await dispatch(getAllEvents());
      setIsLoaded(true);
    }
    fetchEvents();
  }, [dispatch, events])

  let sortedEvents = Object.values(events);
  const sortByStartDate = (a, b) => {
    const left = new Date(a.startDate);
    const right = new Date(b.startDate);
    const today = new Date();
    if (left < today && right >= today) {
      return 1;
    } else if (left >= today && right < today) {
      return -1;
    } else {
      return left-right;
    }
  };
  sortedEvents.sort(sortByStartDate);
  return (
    <React.Fragment>
      {isLoaded && (
        <div className='list'>
          <p className='subText'>Events in Meetup</p>
          {sortedEvents.map((event) => (
            <div key={event.id}>
              <EventListItem event={event}/>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default EventList;
