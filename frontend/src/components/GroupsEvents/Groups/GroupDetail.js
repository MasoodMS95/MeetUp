import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleGroup } from "../../../store/groups";
import '../../../css/GroupsEvents/GroupDetail.css'

function GroupDetail(){
  const {groupId} = useParams();
  const [isLoaded, setIsloaded] = useState(false);
  const dispatch = useDispatch();
  const groupDetails = useSelector(state=>state.groups.singleGroup);

  let imgURL= ""
  if(groupDetails.GroupImages){
    imgURL = groupDetails.GroupImages.filter(image => image.preview===true)[0].url;
  }

  let pastEvents=[];
  let futureEvents=[];

  useEffect(()=>{
    dispatch(getSingleGroup(groupId))
    .then(setIsloaded(true))
  }, [dispatch])

  console.log(groupDetails);
  return (
    <React.Fragment>
      {isLoaded && (
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
        </div>
    </div>)}
    </React.Fragment>
  )
}

export default GroupDetail;
