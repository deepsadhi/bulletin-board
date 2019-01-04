import Boom from 'boom';

import User from '../models/user';
import * as tokenService from './tokenService';
import * as sessionService from './sessionService';

/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  return User.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  return new User({ id }).fetch().then(user => {
    if (!user) {
      throw new Boom.notFound('User not found');
    }

    return user;
  });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function createUser(user) {
  return new User({ name: user.name }).save().then(user => user.refresh());
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id }).save({ name: user.name }).then(user => user.refresh());
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => user.destroy());
}

/**
 * Check the database to see if user exists and if exists, return token.
 *
 * @param {Object} data
 * @returns {Promise}
 */
export async function loginUser(data) {
  try {
    let email = data.email;
    let user = await fetchByEmail(email);

    if (user) {
      let { id, name } = data;
      let tokens = tokenService.generateTokens(id);
      let userInfo = {
        user: {
          id,
          name
        },
        tokens
      };

      await sessionService.createSession(userInfo);

      return userInfo;
    }

    throw new Boom.notFound('User not registered');
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch User by email.
 *
 * @param {string} email
 * @returns {Promise}
 */
export async function fetchByEmail(email) {
  try {
    let result = await new User({ email }).fetch();

    return result;
  } catch (err) {
    throw err;
  }
}
