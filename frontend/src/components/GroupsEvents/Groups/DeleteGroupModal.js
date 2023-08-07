import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { deleteGroup } from '../../../store/groups';
import '../../../css/GroupsEvents/DeleteGroupModal.css'

function DeleteGroupModal({groupId}){
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();

  return(
    <div className='deleteGroupModal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this group?</p>
      <div className='deleteGroupModalButtonsContainer'>
        <button id='confirmDeleteGroupButton' onClick={async ()=>{
          try{
            history.push('/loading');
            await dispatch(deleteGroup(groupId))
            .then(()=>{
              history.push('/groups');
              closeModal();
            })
          }
          catch(err){
            history.push('/404')
          }
        }
        }>Yes (Delete Group)</button>
        <button id='cancelDeleteGroupButton' onClick={()=>{
          closeModal();
        }}>No (Keep Group)</button>
      </div>
    </div>
  )
}

export default DeleteGroupModal
