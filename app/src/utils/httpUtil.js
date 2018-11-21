import axios from 'axios';

import * as bulletinUtil from './bulletinUtil';
import urlConstants from '../constants/urlConstants';
import textConstants from '../constants/textConstants';

export function get(url, params = {}) {
  let request = {
    method: 'get',
    url: url,
    params: params
  };

  return axios(request);
}

export function post(url, data) {
  let request = {
    method: 'post',
    url: url,
    data: data
  };

  return axios(request);
}

export function put(url, data) {
  let request = {
    method: 'put',
    url: url,
    data: data
  };

  return axios(request);
}

export function remove(url, data = {}) {
  let request = {
    method: 'delete',
    data,
    url
  };
  
  return axios(request);
}

axios.interceptors.response.use(response => {
  return response;
}, (error) => {
  let originalRequest = error.config;

  if(error.response.status === textConstants.unauthorizedCode && error.response.data.error.message == textConstants.accessTokenExpire) {
    const refreshToken = localStorage.getItem('refreshToken');
    let tokenRequest = {
      method: 'post',
      url: urlConstants.apiBaseUrl + '/refresh',
      data: {
        authorization: 'Bearer ' + refreshToken
      }
    };

    return axios(tokenRequest).then(({data}) => {
      localStorage.setItem('accessToken', data.accessToken);
      originalRequest.headers.Authorization = 'Bearer ' + data.accessToken;
      return axios(originalRequest);
    });
  } else if (error.response.status === textConstants.unauthorizedCode && error.response.data.error.message == textConstants.refreshTokenExpire) {
    bulletinUtil.logout();

  }

  return Promise.reject(error);  
});

axios.interceptors.request.use((config) => {
  let accessToken = localStorage.getItem('accessToken') || null;

  if (accessToken != null || accessToken != undefined) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, (err) => {
  return Promise.reject(err);
});
