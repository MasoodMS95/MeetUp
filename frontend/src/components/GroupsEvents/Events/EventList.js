import { useSelector, useDispatch } from 'react-redux';
import '../../../css/GroupsEvents/GroupList.css'
import { useEffect, useState } from 'react';
import { getAllGroups } from '../../../store/groups';

function EventList(){
  const events = useSelector(state => state.events.allEvents)
  console.log(events);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const dispatch = useDispatch();

  // useEffect(()=>{
  //   dispatch(getAllGroups()).then(()=>setIsLoaded(true));
  // }, [dispatch])

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
