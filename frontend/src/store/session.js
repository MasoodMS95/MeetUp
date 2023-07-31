import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOG_IN_SESSION = 'session/LOG_IN_SESSION';
export const LOG_OUT_SESSION = 'session/LOG_OUT_SESSION';

/**  Action Creators: */
export const loginAction = (user) => ({
  type: LOG_IN_SESSION,
  user,
})

export const logoutAction = () => ({
  type: LOG_OUT_SESSION
})

/** Thunk Action Creators: */
export const login = (user) => async (dispatch) =>{
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify(user),
  })
  if(res.ok){
    let parsedUser = await res.json();
    dispatch(loginAction(parsedUser.user));
    return parsedUser;
  }
  return await res.json();
}

//Reducer
const sessionReducer = (state = {user:null}, action) => {
  switch (action.type) {
    case LOG_IN_SESSION:
      const newUser = {};
      newUser.user = action.user;
      return newUser
    case LOG_OUT_SESSION:
      const loggedOutUser = {};
      loggedOutUser.user = null;
      return newUser;
    default:
      return state;
  }
};

export default sessionReducer;
