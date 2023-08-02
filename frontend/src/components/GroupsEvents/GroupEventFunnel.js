import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import GroupList from "./Group/GroupList";
import EventList from "./Events/EventList";
import '../../css/GroupsEvents/GroupEventFunnel.css'
import { getAllGroups } from "../../store/groups";
import { getAllEvents } from "../../store/events";

function GroupEventFunnel(){
  const history = useHistory();
  const location = useLocation();
  const [currGroupFlag, setCurrGroupFlag] = useState(location.pathname.includes('groups'));
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getAllGroups())
    .then(dispatch(getAllEvents()))
    .then(()=>setIsLoaded(true));
  }, [dispatch])


  const groupClassSetter = () => {
    if(currGroupFlag){
      return 'active';
    }
    else return 'inactive'
  }
  const eventClassSetter = () => {
    if(!currGroupFlag){
      return 'active';
    }
    else return 'inactive'
  }

  const handleClick = (e, flag) => {
    e.preventDefault();
    setCurrGroupFlag(flag);
    if(flag){
      history.push('/groups')
    }
    else{
      history.push('/events');
    }
  }

  return (
    <React.Fragment>
      {isLoaded && (<div className='allList'>
        <div className='funnelHeaderContainer'>
          <h2 onClick={(e) => handleClick(e, false)} className={eventClassSetter()}>Events</h2>
          <h2 onClick={(e) => handleClick(e, true)} className={groupClassSetter()}>Groups</h2>
        </div>
        {currGroupFlag && <GroupList />}
        {!currGroupFlag && <EventList />}
      </div>)}
    </React.Fragment>
  )
}

export default GroupEventFunnel;
