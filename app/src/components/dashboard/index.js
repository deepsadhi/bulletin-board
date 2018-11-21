import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import SideMenu from './SideMenu';
import ListEntries from '../listEntries';

class Dashboard extends Component {

  constructor () {
    super();

    this.user = JSON.parse(localStorage.getItem('user')) || '';
  }

  render () {

    return (
      <div>
        <div className="clearfix">
        
          <div className="left-content sidemenu-wrapper">
            <SideMenu user={this.user}/>
          </div>

          <div className="left-content main-container-wrapper">
            <div className="container">
              <Redirect to="/dashboard/list"/>
              <Route
                exact path="/dashboard/list"
                render={() => (                  
                  <ListEntries/>                                   
                )}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default Dashboard;
