import { useSelector } from 'react-redux';

import '../../../css/GroupsEvents/GroupEventLists.css'
import EventListItem from './EventListItem';

function EventList(){
  const events = useSelector(state => state.events.allEvents)
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
  <div className='list'>
    <p className='subText'>Events in Meetup</p>
    {sortedEvents.map((event) => (
      <div key={event.id}>
        <EventListItem event={event}/>
      </div>
    ))}
  </div>
  )
}

export default EventList;
