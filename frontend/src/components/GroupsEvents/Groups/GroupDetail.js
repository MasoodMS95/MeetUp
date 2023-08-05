import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
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
  const user = useSelector(state=>state.session.user)
  const history = useHistory();
  let imgURL= ""
  if(groupDetails.GroupImages && groupDetails.GroupImages.length > 0){
    imgURL = groupDetails.GroupImages.filter(image => image.preview===true)[0].url;
  }

  let pastEvents=[];
  let futureEvents=[];
  if(groupDetails && groupDetails.Events && isEventsLoaded){
    const today = new Date();
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

  const sortByStartDate = (a, b) => {
    const left = new Date(a.startDate);
    const right = new Date(b.startDate);
    return left-right;
  };
  futureEvents.sort(sortByStartDate);

  useEffect(()=>{
    const fetchAll = async () => {
      await Promise.all([dispatch(getSingleGroup(groupId)), dispatch(getAllEvents())])
      setIsGrouploaded(true)
      setIsEventsloaded(true)
    }
    fetchAll();
  }, [dispatch, groupId, user])

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
            <p className="lesser">{`${groupDetails.numEvents} Event(s) · ${groupDetails.private ? 'Private' : 'Public'}`}</p>
            <p className="lesser">{`Organized by ${groupDetails.Organizer ? groupDetails.Organizer.firstName : 'John'} ${groupDetails.Organizer ? groupDetails.Organizer.lastName : 'Doe'}`}</p>
            {user && user.id !== groupDetails.organizerId && (<button onClick={() => window.alert('Feature coming soon')} id='joinGroupBtn'> Join this group </button>)}
            {user && user.id === groupDetails.organizerId && (
              <div id='loggedInButtonsForGroup'>
                <button>Create event</button>
                <button onClick={()=>history.push(`/groups/${groupDetails.id}/edit`)}>Update</button>
                <button>Delete</button>
              </div>
            )}
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
                {futureEvents.map(event => event && (
                  <div key={event.id}>
                    <EventListItem event={event}/>
                  </div>
                ))}
              </React.Fragment>
            )
          }
          {
            pastEvents.length > 0 && (
              <React.Fragment>
                <h2>{`Past Events (${pastEvents.length})`}</h2>
                {pastEvents.map(event => event && (
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
