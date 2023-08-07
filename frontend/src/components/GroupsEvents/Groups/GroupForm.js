import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../../../store/groups";
import { useHistory, useParams } from "react-router-dom";
import { getSingleGroup } from "../../../store/groups";
import { updateGroup } from "../../../store/groups";
import '../../../css/GroupsEvents/GroupForm.css'

function GroupForm({action}){
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [type, setType] = useState('');
  const [privacy, setPrivacy] = useState('')
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [errors, setErrors] = useState({})
  const [isloaded, setIsLoaded] = useState(false);
  const groupDetails = useSelector(state=>state.groups.singleGroup)
  const user = useSelector(state=>state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  let {id} = useParams();
  const isUpdate = action === 'update';

  useEffect(()=>{
    const fetchAndSet = async () =>{
      if(isUpdate && id){
        await dispatch(getSingleGroup(id))
        .then((res)=>{
          setName(res.name);
          setCity(res.city);
          setState(res.state);
          setAbout(res.about);
          setPrivacy(res.private)
          setType(res.type);
          setIsLoaded(true);
          }
        )
      }
      else{
        setName('');
        setCity('');
        setState('');
        setAbout('');
        setPrivacy('')
        setType('');
        setIsLoaded(true);
      }
    }
    fetchAndSet();
  },[dispatch, action, isloaded])

  useEffect(()=>{
    if(!user){
      history.push('/NoUserLoggedIn');
    }
  }, [user])

  useEffect(()=>{
    if(Object.values(groupDetails).length > 1){
      if(isUpdate && (user.id !== groupDetails.organizerId)){
        window.alert('Unauthorized Access.')
        history.push('/');
      }
    }
  }, [groupDetails])

  const errorHandler = () => {
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
    if(privacy===''){
      errs.privacy = true;
    }
    if(type===''){
      errs.type = true;
    }
    let parsedURL = imgURL.split('.');
    if(!isUpdate && (!imgURL || !endings.includes(parsedURL[parsedURL.length-1]))){
      errs.imgURL = true;
    }
    setErrors(errs);
    return errs;
  }

  const submitHandler = async (e) =>{
    e.preventDefault();
    const errs = errorHandler();

    if(!Object.values(errs).length){
      let res;
      if(isUpdate){
        res = await dispatch(updateGroup({name, about, type, privacy, city, state}, groupDetails.id))
      }
      else{
        res = await dispatch(createGroup({name, about, type, privacy, city, state, imgURL}));
      }
      history.push(`/groups/${res.id}`);
    }
  }
  return (
    <React.Fragment>
      <form className='groupFormContainer' onSubmit={submitHandler}>
        <div className='groupFormSection'>
          <h3>{isUpdate? 'Update your group' : 'Start a New Group'}</h3>
          <h2>{isUpdate? 'We\'ll walk you through a few steps to update your group.' : 'We\'ll walk you through a few steps to build your local community'}</h2>
        </div>

        <div className='groupFormSection'>
          <h2>Set your group's location</h2>
          <p className='subtext'>The Meetup groups meet locally, in person, and online. We'll connect you with people in your area.</p>
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
          {errors.location && (<p className='errors gFormError'>Location is required</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>What will your group's name be?</h2>
          <p className='subtext'>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
          <input
            value={name}
            placeholder="What is your group name?"
            onChange={(e) => setName(e.target.value)}
            ></input>
            {errors.name && (<p className='errors gFormError'>Name is required</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>Describe the purpose of your group.</h2>
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
          {errors.about && (<p className='errors gFormError'>Description must be at least 50 characters long</p>)}
        </div>

        <div className='groupFormSection'>
          <h2>Final steps...</h2>
          <p className="noBottomMargin">Is this an in person or online group?</p>
          <select
            onChange={(e)=>setType(e.target.value)}
            value={type}
          >
            <option value="">(select one)</option>
            <option>In person</option>
            <option>Online</option>
          </select>
          {errors.type && (<p className="errors gFormError">Group Type is required</p>)}
          <p className="noBottomMargin">Is this group private or public?</p>
          <select
            value={privacy}
            onChange={(e)=>setPrivacy(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value={true}>Private</option>
            <option value={false}>Public</option>
          </select>
          {errors.privacy && (<p className="errors gFormError">Visibility Type Required</p>)}
          {!isUpdate && (
          <React.Fragment>
            <p className="noBottomMargin">Please add an image url for your group below:</p>
            <input
              value={imgURL}
              onChange={e=>setImgURL(e.target.value)}
              placeholder="Image Url"
            ></input>
            {errors.imgURL && (<p className="errors gFormError">Image URL must end in .png, .jpg, or .jpeg</p>)}
          </React.Fragment>
          )}
        </div>

        <button>{isUpdate ? 'Update Group':'Create Group'}</button>
      </form>
    </React.Fragment>
  )
}

export default GroupForm;
