import { useSelector } from 'react-redux';
import '../../../css/GroupsEvents/GroupList.css'

function EventList(){
  const events = useSelector(state => state.events.allEvents)

  return (
  <div className='list'>
    <p className='subText'>Events in Meetup</p>
    {Object.values(events).map((event) => (
      <div key={event.id}>
        <p>{event.id}</p>
      </div>
    ))}
  </div>
  )
}

export default EventList;
