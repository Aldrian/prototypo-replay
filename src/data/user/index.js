import { push } from 'react-router-redux';
import { request, GraphQLClient } from 'graphql-request';
import {
  getPrototypoUser,
  authenticateUser,
  getUserProjects,
} from '../queries';
import { GRAPHQL_PROTOTYPO_API } from '../constants';

export const CONNECT_TO_PROTOTYPO = 'user/CONNECT_TO_PROTOTYPO';
export const CONNECTING_TO_PROTOTYPO = 'user/CONNECTING_TO_PROTOTYPO';
export const CONNECT_ERROR = 'user/CONNECT_ERROR';
export const LOGOUT = 'user/LOGOUT';

const initialState = {
  //prototypoUserId,
  //prototypoEmail,
  projects: [],
  isConnecting: false,
  connectErrorMessage: '',
  token: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTING_TO_PROTOTYPO:
      return {
        ...state,
        isConnecting: true,
        connectErrorMessage: '',
      }
    case CONNECT_TO_PROTOTYPO:
      return {
        ...state,
        projects: action.projects,
        isConnecting: false,
        connectErrorMessage: '',
        token: action.token,
      };
    case CONNECT_ERROR: {
      return {
        ...state,
        isConnecting: false,
        connectErrorMessage: action.errorMessage,
      }
    }

    case LOGOUT:
      return {
        ...state,
        projects: [],
        isConnecting: false,
        connectErrorMessage: '',
        token: undefined,
      };

    default:
      return state;
  }
};

export const connectToPrototypo = (email, password) => (dispatch, getState) => {  
  dispatch({type: CONNECTING_TO_PROTOTYPO});
  request(GRAPHQL_PROTOTYPO_API, getPrototypoUser(email))
  .then((data) => {
    const userID = data.User.id;
    request(GRAPHQL_PROTOTYPO_API, authenticateUser(email, password))
    .then((res) => {
      const token = res.authenticateEmailUser.token;
      const client = new GraphQLClient(GRAPHQL_PROTOTYPO_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      client.request(
        getUserProjects(userID)
      )
      .then((fonts) => {
        dispatch({
          type: CONNECT_TO_PROTOTYPO,
          projects: fonts.User.library,
          token,
        });
        dispatch(push('/selectFont'));
      })
      .catch(error => {
        dispatch({
          type: CONNECT_ERROR,
          errorMessage: 'Could not fetch projects: ' + error,
        });
      });
    })
    .catch(error => {
      dispatch({
        type: CONNECT_ERROR,
        errorMessage: 'Invalid credentials: ' + error,
      });
    });
  })
  .catch((error) => {
    dispatch({
      type: CONNECT_ERROR,
      errorMessage: 'User not found: '  + error,
    });
  })
};

export const logout = () => (dispatch, getState) => {dispatch({type: LOGOUT})};
