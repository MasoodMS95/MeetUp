import '../../../css/GroupsEvents/EventListItem.css'
import { useHistory } from 'react-router-dom';

function EventListItem({event}){
  const history = useHistory();
  const handeClick = (e) => {
    e.preventDefault();
    history.push(`/events/${event.id}`)
  }

  let city = "";
  let state = "";
  if(event.Venue){
    city = event.Venue.city;
    state = event.Venue.state;
  }
  let parsedDate = [];
  if(event.startDate){
    parsedDate = event.startDate.split(" ");
  }

  return(
    <div onClick={(e)=>handeClick(e)} className='eventListItemContainer'>
      <div className='eventListItemHeaderContainer'>
        <img src={event.previewImage} alt='No Preview Image Available'></img>
        <div className='EventInfo'>
          <h3>{`${parsedDate[0]} ·  <${parsedDate[1].slice(0,5)}>`}</h3>
          <p className='eventName'>{event.name}</p>
          <p className='eventLocation gray'>{`Location: ${city}, ${state}`}</p>
        </div>
      </div>
      <div className='eventListItemFooterContainer'>
        <p>{event.description}</p>
      </div>
    </div>
  )
}

export default EventListItem;
