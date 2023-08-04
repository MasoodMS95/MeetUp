// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };


  const setChevron = () => {
    if(showMenu){
      return (
        <i className="fa-solid fa-chevron-down" />
      )
    }
    else{
      return (
        <i className="fa-solid fa-chevron-up" />
      )
    }
  }

  useEffect(() => {
    setChevron();
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
        {setChevron()}
      </button>
      {showMenu && <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li className='modalLine'>{user.email}</li>
        <li className='modalLine'>
          <button onClick={()=>{
            history.push('/groups')
          }}>View groups</button>
        </li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>}
    </>
  );
}

export default ProfileButton;
