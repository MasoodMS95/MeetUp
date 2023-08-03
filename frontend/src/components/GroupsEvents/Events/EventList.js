import { useSelector } from 'react-redux';

import '../../../css/GroupsEvents/GroupEventLists.css'
import EventListItem from './EventListItem';

function EventList(){
  const events = useSelector(state => state.events.allEvents)

  return (
  <div className='list'>
    <p className='subText'>Events in Meetup</p>
    {Object.values(events).map((event) => (
      <div key={event.id}>
        <EventListItem event={event}/>
      </div>
    ))}
  </div>
  )
}

export default EventList;
