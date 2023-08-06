import { useDispatch, useSelector } from 'react-redux';
import '../../../css/GroupsEvents/GroupEventLists.css'
import GroupListItem from './GroupListItem';
import React, { useEffect, useState } from 'react';
import { getAllGroups } from '../../../store/groups';

function GroupList(){
  const groups = useSelector(state => state.groups.allGroups);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=>{
    const fetchGroup = async () => {
      await dispatch(getAllGroups())
      .then(setIsLoaded(true))
    }
    fetchGroup();
  }, [dispatch, groups])

  return (
    <React.Fragment>
      {isLoaded && (
      <div className='list'>
        <p className='subText'>Groups in Meetup</p>
        {Object.values(groups).map((group) => (
          <div key={group.id}>
            <GroupListItem group={group} />
          </div>
        ))}
      </div>
      )}
    </React.Fragment>
  )
}

export default GroupList;
