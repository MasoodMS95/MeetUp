import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "../../css/Navigation/LoginFormPage.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className = 'loginPage'>
    <h1>Log In</h1>
    <form onSubmit={handleSubmit}>
      <div className='credential'>
        <input
            type="text"
            value={credential}
            placeholder="Username or Email"
            onChange={(e) => setCredential(e.target.value)}
            required
        />
      </div>
      <div className='password'>
        <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
      </div>
      {errors.credential && <p className="errors">{errors.credential}</p>}
      <button disabled={!password || !credential || password.length < 6 || credential.length < 4} type="submit">Log In</button>
      <button onClick={async (e) => {
        e.preventDefault();
        dispatch(sessionActions.login({ credential: 'testy@tester.io', password: 'password' }))
        closeModal();
      }}>Demo User</button>
    </form>
  </div>
  );
}

export default LoginFormModal;
