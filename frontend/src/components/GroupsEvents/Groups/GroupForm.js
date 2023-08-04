import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../store/groups";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function GroupForm({action}){
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [type, setType] = useState('');
  const [privacy, setPrivacy] = useState('')
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch();
  const history = useHistory();


  const submitHandler = async (e) =>{
    e.preventDefault();

    const endings = ['jpg', 'jpeg', 'png'];
    const errs = {};
    if(!name){
      errs.name = true;
    }
    if(!city || !state){
      errs.location = true;
    }
    if(about.length < 50){
      errs.about = true;
    }
    if(!privacy){
      errs.privacy = true;
    }
    if(!type){
      errs.type = true;
    }
    let parsedURL = imgURL.split('.');
    if(!imgURL || !endings.includes(parsedURL[parsedURL.length-1])){
      errs.imgURL = true
    }
    setErrors(errs);
    console.log(Object.values(errs));


    if(!Object.values(errs).length){
      const res = await dispatch(createGroup({name, about, type, privacy, city, state}))
      console.log(res);
      history.push(`/groups/${res.id}`)
    }
  }
  return (
    <React.Fragment>
      <form className='groupFormContainer' onSubmit={submitHandler}>
        <div className='groupFormSection'>
          <h3>BECOME AN ORGANIZER</h3>
          <h2>We'll walk you through a few steps to build your local community</h2>
        </div>

        <div className='groupFormSection'>
          <h2>First, set your group's location</h2>
          <p className='subtext'>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online</p>
          <input
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            ></input>
          <input
            value={state}
            placeholder="State"
            onChange={(e) => setState(e.target.value)}
            ></input>
          {errors.location && (<p className='errors'>Location is required</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>What will your group's name be?</h2>
          <p className='subtext'>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <input
            value={name}
            placeholder="What is your group name?"
            onChange={(e) => setName(e.target.value)}
            ></input>
            {errors.name && (<p className='errors'>Name is required</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>Now describe what your group will be about</h2>
          <p className='subtext'>People will see this when we promote your group, but you'll be able to add it later, too.</p>

          <span>
            <p className='noMargin'>1. What's the purpose of the group?</p>
            <p className='noMargin'>2. Who should join?</p>
            <p className='noMargin'>3. What will you do at your events?</p>
          </span>
          <textarea
            value={about}
            placeholder="Please write at least 50 characters"
            onChange={(e)=>setAbout(e.target.value)}
          ></textarea>
          {errors.about && (<p className='errors'>Description must be at least 50 characters long</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>Final steps...</h2>
          <p>Is this an in person or online group?</p>
          <select
            onChange={(e)=>setType(e.target.value)}
          >
            <option value="">(select one)</option>
            <option>In person</option>
            <option>Online</option>
          </select>
          {errors.type && (<p className="errors">Group Type is required</p>)}
          <p>Is this group private or public?</p>
          <select
            value={privacy}
            onChange={(e)=>setPrivacy(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value={true}>Private</option>
            <option value={false}>Public</option>
          </select>
          {errors.privacy && (<p className="errors">Visibility Type Required</p>)}
        </div>

        <div className='groupFormSection'>
          <p className='subtext'>Please add in image url for your group below:</p>
          <input
            value={imgURL}
            onChange={e=>setImgURL(e.target.value)}
          ></input>
          {errors.imgURL && (<p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>)}
        </div>

        <button>Create Group</button>
      </form>
    </React.Fragment>
  )
}

export default GroupForm;
