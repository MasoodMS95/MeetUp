import '../../../css/GroupsEvents/GroupListItem.css'
import { useHistory } from 'react-router-dom';
function GroupListItem({group}){
  const history = useHistory();
  const handeClick = (e) => {
    e.preventDefault();
    history.push(`/groups/${group.id}`)
  }
  return(
    <div onClick={(e)=>handeClick(e)} className='groupListItemContainer'>
      <img src={group.previewImage} alt='No Preview Image Available'></img>
      <div className='groupInfo'>
        <h3>{group.name}</h3>
        <p className='groupLocation gray'>{`Location: ${group.city}, ${group.state}`}</p>
        <p className='groupDescription'>{group.about}</p>
        <div className='listItemFooter gray'>
          <p>{`${group.numEvents} event(s)`}</p>
          <p>*</p>
          <p>{group.private ? 'Private' : 'Public'}</p>
        </div>
      </div>

    </div>
  )
}

export default GroupListItem;
