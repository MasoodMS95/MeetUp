// frontend/src/components/LoginFormPage/index.js
import React, { useState } from "react";
import * as sessionActions from "../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import '../css/LoginFormPage.css'

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <div className = 'loginPage'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='credential'>
          <label>
            Username or Email:
          </label>
          <input
              type="text"
              value={credential}
              placeholder="sample@email.com"
              onChange={(e) => setCredential(e.target.value)}
              required
          />
        </div>
        <div className='password'>
          <label>
            Password:
          </label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormPage;
