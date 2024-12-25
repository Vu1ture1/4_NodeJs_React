import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { GoogleOAuthProvider } from '@react-oauth/google'; 
import GoogleLoginButton from './components/login-google.component';

import LoginButton from './components/login.component';
import Register from './components/registration.component';
import Profile from './components/profile.component';
import Cart from './components/cart.component';


import { UserProvider } from './hooks/user.hooks';

import AddMed from "./components/add-med.component";
import Med from "./components/med.component";
import MedsList from "./components/meds-list.component";
import DepartmentList from "./components/departments-list.component";
import CurrentDepMedList from "./components/med-on-department.component";
import chhhh from "./components/check.cookie";

import Nav_Bar from "./nav-bar.component";

import PrivateRoute from './routes/private.route.component';
import PublicRoute from './routes/public.route.component';

class App extends Component {
  render() {
    return (
      <UserProvider>
        <Router>
          <Nav_Bar></Nav_Bar>
          
          <div className="container mt-3">
            <Switch>
              {/* <Route exact path={["/", "/meds"]} component={MedsList} /> */}
              {/* <Route exact path="/add" component={AddMed} /> */}
              
              {/* <Route path="" component={Med} /> */}
              <Route exact path={["/", "/departments"]} component={DepartmentList} /> 
              <Route path="/departments/:departmentId" component={CurrentDepMedList} />
              <Route path="/cookie" component={chhhh} />
              
              {/* <Route path="/login" component={LoginButton} /> */}
              {/* <Route path="/registration" component={Register} /> */}
              
              <PublicRoute restricted={true} component={LoginButton} path="/login" exact />
              <PublicRoute restricted={true} component={Register} path="/registration" exact />

              <PrivateRoute component={MedsList} path="/meds" exact />
              <PrivateRoute component={AddMed} path="/add" exact />
              <PrivateRoute component={Med} path="/meds/:id" exact />
              <PrivateRoute component={Cart} path="/cart" exact />
              <PrivateRoute component={Profile} path="/profile" exact />
            </Switch>
          </div>
        </Router>
      </UserProvider>
    );
  }
}

export default App;