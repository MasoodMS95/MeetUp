import { useSelector, useDispatch } from 'react-redux';
import '../../../css/GroupsEvents/GroupList.css'
import { useEffect, useState } from 'react';
import { getAllGroups } from '../../../store/groups';
import GroupListItem from './GroupListItem';

function GroupList(){
  const groups = useSelector(state => state.groups.allGroups)
  // const [isLoaded, setIsLoaded] = useState(false);
  // const dispatch = useDispatch();

  // useEffect(()=>{
  //   dispatch(getAllGroups()).then(()=>setIsLoaded(true));
  // }, [dispatch])

  return (
  <div className='list'>
    <p className='subText'>Groups in Meetup</p>
    {Object.values(groups).map((group) => (
      <div key={group.id}>
        <GroupListItem group={group} />
      </div>
    ))}
  </div>
  )
}

export default GroupList;
