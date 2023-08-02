import { useSelector } from 'react-redux';
import '../../../css/GroupsEvents/GroupList.css'
import GroupListItem from './GroupListItem';

function GroupList(){
  const groups = useSelector(state => state.groups.allGroups)

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
