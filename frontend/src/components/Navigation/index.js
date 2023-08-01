import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import '../../css/Navigation/Navigation.css';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from '../SignupFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className='navButtons'>
        {sessionUser && <Link>Start a new group</Link>}
        <div className = 'navLoggedIn'>
          <ProfileButton user={sessionUser} />
        </div>
      </li>
    );
  } else {
    sessionLinks = (
      <li className='navButtons navLoggedOut'>
         <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Signup"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <ul className='NavBar'>
      <li className='homeButton'>
        <NavLink id='title' exact to="/">The Meetup</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
