import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
function App() {
  return (
    <React.Fragment>
      <h1>Hello from App</h1>
      <Switch>
        <Route path='/login'>
          <LoginFormPage />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
