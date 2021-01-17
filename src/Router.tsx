import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/tracker" exact component={() => <></>} />
        <Route component={() => <>404 - page not found</>} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
