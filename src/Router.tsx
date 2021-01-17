import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Error404Screen, TrackerScreen } from './screens'
const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/tracker" exact component={TrackerScreen} />
        <Route component={Error404Screen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
