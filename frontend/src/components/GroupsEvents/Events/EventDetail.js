import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { getSingleEvent } from "../../../store/events";
import clockImg from '../../../images/simpleclock.png'
import priceImg from '../../../images/price.png'
import locationImg from '../../../images/location.png'
import '../../../css/GroupsEvents/EventDetail.css'

function EventDetail(){
  const {eventId} = useParams();
  const [isLoaded, setIsloaded] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const eventDetails = useSelector(state=>state.events.singleEvent);

  let imgURL = "";
  if(eventDetails.EventImages){
    imgURL = eventDetails.EventImages.filter(event => event.preview===true)[0].url;
  }

  let groupImageUrl = "";
  if(eventDetails.GroupImages){
    groupImageUrl = eventDetails.GroupImages.filter(image => image.preview===true)[0].url;
  }
  let groupId = -1;
  let privacy = "";
  if(eventDetails.Group){
    if(eventDetails.Group.private){
      privacy = 'Private';
    }
    else privacy = 'Public'
    groupId = eventDetails.Group.id
  }

  let groupName = "";
  if(eventDetails.Group){
    groupName = eventDetails.Group.name;
  }

  let parsedStartDate = [];
  if(eventDetails.startDate){
    parsedStartDate = eventDetails.startDate.split(" ");
  }
  let parsedEndDate = [];
  if(eventDetails.endDate){
    parsedEndDate = eventDetails.endDate.split(" ");
  }

  let firstName = "";
  let lastName = "";
  if(eventDetails.Organizer){
    firstName = eventDetails.Organizer.firstName;
    lastName = eventDetails.Organizer.lastName;
  }

  let price="FREE"
  if(eventDetails.price){
    if(eventDetails.price > 1){
      price = eventDetails.price
    }
  }

  useEffect(()=>{
    dispatch(getSingleEvent(eventId))
    .then(setIsloaded(true))
  }, [dispatch])

  console.log(eventDetails);
  return (
    <React.Fragment>
      {isLoaded && (
        <React.Fragment>
          <div className='eventDetailsContainer'>
            <div className='eventDetailsHeader'>
              <Link to='/events'>{'< Events'}</Link>
              <h2>{eventDetails.name}</h2>
              <p>{`Hosted by ${firstName} ${lastName}`}</p>
            </div>
            <div className='eventDetailsMidSection'>
              <img src={imgURL} alt='No preview image found'></img>
              <div className='midSectionDetails'>
                <div onClick={()=>(history.push(`/groups/${groupId}`))} className='eventGroupInfo'>
                  <img src={groupImageUrl}></img>
                  <div className='eventGroupInfoText'>
                    <p>{groupName}</p>
                    <p id='privacy'>{privacy}</p>
                  </div>
                </div>
                <div className='eventInfo'>
                  <div className='time'>
                    <img src={clockImg}/>
                    <div className='timeInfoContainer'>
                      <div id='eventInfoText'>
                        <p id='gray'>Start </p>
                        <p>{`${parsedStartDate[0]} *  <${parsedStartDate.length>0? parsedStartDate[1].slice(0,5) : 'TBD'}>`}</p>
                      </div>
                      <div id='eventInfoText'>
                        <p id='gray'>End&nbsp;</p>
                        <p>{`${parsedEndDate[0]} *  <${parsedEndDate.length>0?  parsedEndDate[1].slice(0,5) : 'TBD'}>`}</p>
                      </div>
                    </div>
                  </div>
                  <div className='price'>
                    <img src={priceImg}/>
                    <p id='gray'>{price !== 'FREE'? `$${price}.00` : price}</p>
                  </div>
                  <div className='location'>
                    <img src={locationImg}/>
                    <p id='gray'>{eventDetails.type}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='eventDetailsFooter'>
              <h2>Details</h2>
              <p>{eventDetails.description}</p>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default EventDetail;
