import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom";
import { getSingleGroup } from "../../../store/groups";
import { createEvent } from "../../../store/events";
import '../../../css/GroupsEvents/EventForm.css'

const EventForm = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector(state=>state.groups.singleGroup)
  const user = useSelector(state=>state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});


  useEffect(()=>{
    if(!user){
      window.alert('Unauthorized Access.')
      history.push('/');
    }
    else if(group.organizerId && user.id !== group.organizerId){
      window.alert('Unauthorized Access.');
      history.push('/');
    }
  }, [user, group])

  useEffect(()=>{
    const fetch = async() => {
      try{
        await dispatch(getSingleGroup(id));
        setIsLoaded(true);
      }
      catch(err){
        history.push('/GroupNotFound')
      }
    }

    fetch();
  }, [dispatch])


  const errorValidator = () => {
    const endings = ['jpg', 'jpeg', 'png'];
    const errs = {};
    if(!name || name.length < 5){
      errs.name = true;
    }
    if(!type){
      errs.type = true;
    }
    if(!price || price < 0){
      errs.price = true;
    }
    if(!startDate){
      errs.startDate = true;
    }
    if(!endDate){
      errs.endDate=true;
    }
    let today = new Date();
    let startInput = new Date(startDate);
    if(startInput < today){
      errs.startDate = true;
    }
    if(startDate > endDate){
      errs.endDate = true;
    }
    let parsedURL = imgURL.split('.');
    if(!imgURL || !endings.includes(parsedURL[parsedURL.length-1])){
      errs.imgURL = true;
    }
    if(description.length < 30){
      errs.description = true;
    }
    setErrors(errs);
    return errs;
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    const errs = errorValidator();
    if(!Object.values(errs).length){
      const res = await dispatch(createEvent({name, type, price, description, startDate, endDate}, imgURL, id))
      if(res.id){
        history.push(`/events/${res.id}`)
      }
      else{window.alert('Check errors')}
    }


  }
  return (
    <React.Fragment>
      {isLoaded && (
        <form className='eventFormContainer'
          onSubmit={(e) => submitHandler(e)}
        >
          <h2>{`Create an event for ${group?.name}`}</h2>
          <div className='formSection'>
            <p className='eventFormQuestion'>What is the name of your event?</p>
            <input
              id='nameInput'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Event Name"
            ></input>
            {errors.name && <p className="errors eFormError">Name is required and must be at least 5 characters</p>}
          </div>


          <div className='formSection'>
            <p className='eventFormQuestion'>Is this an in person or online event?</p>
            <select
              id='typeInput'
              value={type}
              onChange={(e)=>setType(e.target.value)}
            >
              <option value=''>(select one)</option>
              <option value='In person'>In person</option>
              <option value='Online'>Online</option>
            </select>
            {errors.type && <p className="errors eFormError">Type is required</p>}
            <p className='eventFormQuestion'>What is the price for your event?</p>
            <input
              type='number'
              onKeyDown={(e)=>{
                if(["+", "-", "e", "E"].includes(e.key)){
                  e.preventDefault();
                }
              }}
              value={price}
              id='priceInput'
              placeholder = '$0'
              onChange={(e)=>{setPrice(e.target.value)}}
            ></input>
            {errors.price && <p className="errors eFormError">Price is required and must be greater than zero</p>}
          </div>

          <div className='formSection'>
            <p className='eventFormQuestion'>When does your event start?</p>
            <input
              value={startDate}
              type='datetime-local'
              placeholder="MM/DD/YYYY HH:mm PM"
              onChange={(e)=>setStartDate(e.target.value)}
            ></input>
            {errors.startDate && <p className="errors eFormError">Event start is required and must be in the future.</p>}

            <p className='eventFormQuestion'>When does your event end?</p>
            <input
              value={endDate}
              type='datetime-local'
              placeholder="MM/DD/YYYY HH:mm PM"
              onChange={(e)=>setEndDate(e.target.value)}
            ></input>
            {errors.endDate && <p className="errors eFormError">Event end is required and must be after start date.</p>}
          </div>

          <div className="formSection">
          <p className='eventFormQuestion'>Please add an image url for your event below.</p>
          <input
            value={imgURL}
            placeholder="Image URL"
            onChange={(e)=>setImgURL(e.target.value)}
          ></input>
          {errors.imgURL && <p className="errors eFormError">Image URL must end in .png, .jpg, or .jpeg</p>}
          </div>

          <div className='formSection'>
            <p className='eventFormQuestion'>Please describe your event:</p>
            <textarea
              value={description}
              placeholder="Please include at least 30 characters"
              onChange={(e)=>setDescription(e.target.value)}
            ></textarea>
            {errors.description && <p className="errors eFormError">Description must be at least 30 characters long.</p>}
          </div>

          <button>Create Event</button>
        </form>
      )}
    </React.Fragment>
  )
}

export default EventForm;
