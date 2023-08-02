import '../../../css/GroupsEvents/GroupListItem.css'

function GroupListItem({group}){
  console.log(group);
  return(
    <div className='groupListItemContainer'>
      <img src={group.previewImage} alt='No Preview Image Available'></img>
      <div className='groupInfo'>
        <h3>{group.name}</h3>
        <p>{`Location: ${group.city}`}</p>
      </div>

    </div>
  )
}

export default GroupListItem;
