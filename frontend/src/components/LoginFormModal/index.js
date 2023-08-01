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
      {errors.credential && <p className="errors">{errors.credential}</p>}
      <button disabled={!password || !credential} type="submit">Log In</button>
    </form>
  </div>
  );
}

export default LoginFormModal;
