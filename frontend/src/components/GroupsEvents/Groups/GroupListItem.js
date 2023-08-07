import { useDispatch } from 'react-redux';
import '../../../css/GroupsEvents/GroupListItem.css'
import { useHistory } from 'react-router-dom';
import { getSingleGroup } from '../../../store/groups';
function GroupListItem({group}){
  const history = useHistory();
  const dispatch = useDispatch();

  const handeClick = async (e) => {
    e.preventDefault();
    // await dispatch(getSingleGroup(group.id))
    // .then(history.push(`/groups/${group.id}`))
    history.push(`/groups/${group.id}`)
  }
  return(
    <div onClick={(e)=>handeClick(e)} className='groupListItemContainer'>
      <img src={group?.previewImage} alt='No Preview Image Available'></img>
      <div className='groupInfo'>
        <h3>{group.name}</h3>
        <p className='groupLocation gray'>{`Location: ${group.city}, ${group.state}`}</p>
        <p className='groupDescription'>{group.about}</p>
        <div className='listItemFooter gray'>
          <p>{`${group.numEvents} event(s)`}</p>
          <p>·</p>
          <p>{group.private ? 'Private' : 'Public'}</p>
        </div>
      </div>

    </div>
  )
}

export default GroupListItem;
