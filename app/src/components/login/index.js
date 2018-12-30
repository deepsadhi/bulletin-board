import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

import textConstants from '../../constants/textConstants';
import * as routes from '../../constants/routes'	
import * as bulletinService from '../../services/bulletinService';
import bulletinLogo from '../../assets/images/bulletin-board-login-image.png';


class GoogleLoginComponent extends Component {
 
  constructor(){
    super();
    this.state={
      isLoggedIn: JSON.parse(localStorage.getItem('user')) ? true : false
    };
  }

  responseGoogle(response){
	  console.log(response)
    let profileObj = response.profileObj;
    let data = {
      tokenId: response.tokenId
    };
    bulletinService.validateAdmin(data)
      .then(res => {
        const {tokens} = res.data.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(profileObj));
      
        this.setState({
          isLoggedIn: true
        });
      })
      .catch(err => err);
  }

  render(){
    const isLoggedIn = this.state.isLoggedIn;
    
    return(
      <div className="login-wrapper">
        { 
          !isLoggedIn ? (
            <div className="login-dialog">
              <img src={bulletinLogo} alt="bulletin logo" className="bulletin-logo-big"/>
              <GoogleLogin
                clientId={textConstants.googleClientId}
                buttonText="Google Login"
                className="login-button-style"
                onSuccess={this.responseGoogle.bind(this)}
                onFailure={this.responseGoogle.bind(this)}
              />
            </div>
          ) :(
            <Redirect
              to={{
                pathname: routes.DASHBOARD
              }}
            />
          )
        }
      </div>
    );
  }

}

export default GoogleLoginComponent;
