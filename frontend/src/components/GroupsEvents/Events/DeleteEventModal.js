import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { deleteEvent, getAllEvents } from '../../../store/events';
import '../../../css/GroupsEvents/DeleteEventModal.css'

function DeleteEventModal({eventId, groupId}){
  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();

  return(
    <div className='deleteEventModal'>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this event?</p>
      <div className='deleteEventModalButtonsContainer'>
        <button id='confirmDeleteEventButton' onClick={async ()=>{
          try{
            history.push('/loading');
            await dispatch(deleteEvent(eventId))
            .then(() => {
              history.push(`/groups/${groupId}`);
              closeModal();
            })
          }
          catch(err){
            history.push('/404')
          }
        }
        }>Yes (Delete Event)</button>
        <button id='cancelDeleteEventButton' onClick={()=>{
          closeModal();
        }}>No (Keep Event)</button>
      </div>
    </div>
  )
}

export default DeleteEventModal
