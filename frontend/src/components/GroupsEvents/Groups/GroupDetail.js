import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleGroup } from "../../../store/groups";
import {getAllEvents} from '../../../store/events'
import EventListItem from '../Events/EventListItem';
import '../../../css/GroupsEvents/GroupDetail.css'

function GroupDetail(){
  const {groupId} = useParams();
  const [isGroupLoaded, setIsGrouploaded] = useState(false);
  const [isEventsLoaded, setIsEventsloaded] = useState(false);
  const dispatch = useDispatch();
  const groupDetails = useSelector(state=>state.groups.singleGroup);
  const events = useSelector(state=>state.events.allEvents)
  let imgURL= ""
  if(groupDetails.GroupImages){
    imgURL = groupDetails.GroupImages.filter(image => image.preview===true)[0].url;
  }

  let pastEvents=[];
  let futureEvents=[];
  if(groupDetails.Events && isEventsLoaded){
    const today = new Date();
    console.log('Inner Events', events);
    groupDetails.Events.forEach(event => {
      let fullEvent = events[event.id];
      console.log('Full Event', fullEvent);
      let eventDate = new Date(event.startDate);
      if(eventDate >= today){
        futureEvents.push(fullEvent);
      }
      else{
        pastEvents.push(fullEvent);
      }
    });
  }

  useEffect(()=>{
    dispatch(getSingleGroup(groupId))
    .then(setIsGrouploaded(true));
    dispatch(getAllEvents())
    .then(setIsEventsloaded(true));
  }, [dispatch])

  return (
    <React.Fragment>
      {isGroupLoaded && isEventsLoaded && (
      <div className="groupDetailsContainer">
        <Link to='/groups'>{'< Groups'}</Link>
        <div className='groupDetailsHeader'>
          <img id='groupImage' src={imgURL} alt='No Preview Image Available'></img>
          <div className='groupDetailsHeaderPillar'>
            <p>{groupDetails.name}</p>
            <p className="lesser">{`${groupDetails.city}, ${groupDetails.state}`}</p>
            <p className="lesser">{`${groupDetails.numEvents} Event(s) *   ${groupDetails.private ? 'Private' : 'Public'}`}</p>
            <p className="lesser">{`Organized by ${groupDetails.Organizer ? groupDetails.Organizer.firstName : 'John'} ${groupDetails.Organizer ? groupDetails.Organizer.lastName : 'Doe'}`}</p>
            <button id='joinGroupBtn'> Join this group </button>
          </div>
        </div>
        <div className='groupAboutMe'>
          <h2>Organizer</h2>
          <p id='gray'>{`${groupDetails.Organizer ? groupDetails.Organizer.firstName : 'John'} ${groupDetails.Organizer ? groupDetails.Organizer.lastName : 'Doe'}`}</p>
          <h2>What we're about</h2>
          <p>{groupDetails.about ? groupDetails.about : 'Just like to hang out.'}</p>
          {
            futureEvents.length>0 && (
              <React.Fragment>
                <h2>{`Upcoming Events (${futureEvents.length})`}</h2>
                {futureEvents.map(event =>(
                  <div key={event.id}>
                    <EventListItem event={event}/>
                  </div>
                ))}
              </React.Fragment>
            )
          }
          {
            pastEvents.length>0 && (
              <React.Fragment>
                <h2>{`Past Events (${pastEvents.length})`}</h2>
                {pastEvents.map(event =>(
                  <div key={event.id}>
                    <EventListItem event={event}/>
                  </div>
                ))}
              </React.Fragment>
            )
          }
        </div>
    </div>)}
    </React.Fragment>
  )
}

export default GroupDetail;
