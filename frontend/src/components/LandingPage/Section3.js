import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from '../SignupFormModal';
import '../../css/LandingPage/Section3.css'
import jgImg from '../../images/joinAGroup.png'
import sgImg from '../../images/startAGroup.png'
import eImg from '../../images/events.png'
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
function Section3(){
  const user = useSelector((state) => state.session.user);
  const swapClickable = () =>{
    if(user){
      return (
        <Link to='/groups'>Start a new group</Link>
      )
    }
    else{
      return (<p id='gray'>Start a new group</p>)
    }
  }
  return (
    <div className="section3Container">
      <div className="sec3Articles">
        <div className='lpArticle article1'>
          <img className='articleImages jgImg' src={sgImg}/>
          <Link to='/groups'>Join a Group</Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className='lpArticle article2'>
          <img className='articleImages' src={eImg}/>
          <Link to='/events'>Find an Event</Link>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className='lpArticle article3'>
          <img className='articleImages' src={jgImg}/>
          {swapClickable()}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      {!user &&
        <label className='footerSignUp'>
          <OpenModalButton
          buttonText="Signup"
          modalComponent={<SignupFormModal />}
        />
        </label>}
    </div>
  )
}

export default Section3;
