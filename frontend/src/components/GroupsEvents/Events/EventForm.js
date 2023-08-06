import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom";
import { getSingleGroup } from "../../../store/groups";
import { createEvent } from "../../../store/events";

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


  useEffect(()=>{console.log('NAME',name)}, [name]);
  useEffect(()=>{console.log('TYPE',type)}, [type]);
  useEffect(()=>{console.log('PRICE',price)}, [price]);
  useEffect(()=>{console.log('START_DATE',startDate)}, [startDate]);
  useEffect(()=>{console.log('END_DATE',endDate)}, [endDate]);
  useEffect(()=>{console.log('IMG_URL',imgURL)}, [imgURL]);
  useEffect(()=>{console.log('DESCRIPTION',description)}, [description]);

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

  /*
    NAME done
    TYPE done
    PRICE done
    START DATE
    END DATE
    IMG URL
    DESCRIPTION
  */
  const errorValidator = () => {
    const endings = ['jpg', 'jpeg', 'png'];
    const errs = {};
    if(!name){
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
    if(startDate < today){
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
    console.log('Errors', errors);

  }
  return (
    <React.Fragment>
      {isLoaded && (
        <form className='eventForm'
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
            {errors.name && <p className="errors">Name is required</p>}
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
            {errors.type && <p className="errors">Type is required</p>}
            <p className='eventFormQuestion'>What is the price for your event?</p>
            <input
              type='number'
              value={price}
              id='priceInput'
              placeholder = '$0'
              onChange={(e)=>{setPrice(e.target.value)}}
            ></input>
            {errors.price && <p className="errors">Price is required and must be greater than zero</p>}
          </div>

          <div className='formSection'>
            <p className='eventFormQuestion'>When does your event start?</p>
            <input
              value={startDate}
              type='datetime-local'
              placeholder="MM/DD/YYYY HH:mm PM"
              onChange={(e)=>setStartDate(e.target.value)}
            ></input>
            {errors.startDate && <p className="errors">Event start is required and must be in the future.</p>}

            <p className='eventFormQuestion'>When does your event end?</p>
            <input
              value={endDate}
              type='datetime-local'
              placeholder="MM/DD/YYYY HH:mm PM"
              onChange={(e)=>setEndDate(e.target.value)}
            ></input>
            {errors.endDate && <p className="errors">Event end is required and must be after start date.</p>}
          </div>

          <div className="formSection">
          <p className='eventFormQuestion'>Please add an image url for your event below.</p>
          <input
            value={imgURL}
            onChange={(e)=>setImgURL(e.target.value)}
          ></input>
          {errors.imgURL && <p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>}
          </div>

          <div className='formSection'>
            <p className='eventFormQuestion'>Please describe your event:</p>
            <textarea
              value={description}
              placeholder="Please include at least 30 characters"
              onChange={(e)=>setDescription(e.target.value)}
            ></textarea>
            {errors.description && <p className="errors">Description must be at least 30 characters long.</p>}
          </div>

          <button>Create Event</button>
        </form>
      )}
    </React.Fragment>
  )
}

export default EventForm;
