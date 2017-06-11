import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  USER_PROFILE_INFORMATION
} from './types';
import firebase from 'firebase';

export const loginUser = ({ email, password, navigateTo }) => {

  return (dispatch) => {
    dispatch({ type: LOGIN_USER_START });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user, navigateTo))
      .catch(error => {
        console.log(error)
        loginUserFailed(dispatch,error)
        /*firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => loginUserSuccess(dispatch, user, navigateTo))
          .catch(error => loginUserFailed(dispatch, error))*/
      });
  }
};

const loginUserSuccess = (dispatch, user, navigateTo) => {
  dispatch({ type: LOGIN_USER_SUCCESS, payload: user })
  // vai a home screen
  navigateTo('Main')
}

const loginUserFailed = (dispatch, error)  => {
  dispatch({ type: LOGIN_USER_FAIL, payload: error })
  alert('Autenticazione fallita')
}


export const userProfileInformation = (dispatch) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    console.log('Current user: ');
    console.log(currentUser);
    console.log('END OF CURRENT USER @@@@@@@@')
    dispatch({type: USER_PROFILE_INFORMATION, payload: currentUser})
  }
}