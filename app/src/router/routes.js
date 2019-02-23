import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import CoreLayoutContainer from '../containers/CoreLayoutContainer';
import HomeContainer from '../containers/HomeContainer'
import SignUpContainer from '../containers/SignUpContainer'
import NotFound from '../components/NotFound'

const routes = (
    <div>
        <CoreLayoutContainer>
            <Switch>
                <Route exact path="/" component={HomeContainer} />
                <Redirect from='/home' to="/" />
                <Route path="/signup" component={SignUpContainer} />
                <Route component={NotFound} />
            </Switch>
        </CoreLayoutContainer>
    </div>
);

export default routes
