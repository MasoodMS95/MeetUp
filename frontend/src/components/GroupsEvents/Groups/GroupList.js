import { useDispatch, useSelector } from 'react-redux';
import '../../../css/GroupsEvents/GroupEventLists.css'
import GroupListItem from './GroupListItem';
import { useEffect, useState } from 'react';
import { getAllGroups } from '../../../store/groups';

function GroupList(){
  const groups = useSelector(state => state.groups.allGroups)
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=>{
    const fetch = async () => {
      await dispatch(getAllGroups());
      setIsLoaded(true);
    }
    fetch();
  }, [dispatch])

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
