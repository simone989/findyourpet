import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_LOGOUT,
  USER_PROFILE_INFORMATION,
  USER_SET_LOCATION,
  USER_SET_MARKER,
  FINDLIST_FETCH_START,
  FINDLIST_FETCH_SUCCESS,
  SIGNUP_USER_FAIL,
  SIGNUP_USER_START,
  SIGNUP_USER_SUCCESS,
  REPORT_FETCH_START,
  REPORT_FETCH_SUCCESS,
  FIND_ADD_SUCCESS,
  FIND_ADD_START,
  FIND_REMOVE,
  REPORT_ADD_ERROR,
  REPORT_ADD_SUCCESS,
  REPORT_ADD_START
} from './types';
import firebase from 'firebase';

export const loginUser = ({ email, password, navigateTo }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER_START });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user, navigateTo))
      .catch(error => {
        loginUserFailed(dispatch,error)
      });
  }
};

const loginUserSuccess = (dispatch, user, navigateTo) => {
  dispatch({ type: LOGIN_USER_SUCCESS, payload: user })
  navigateTo()
}

const loginUserFailed = (dispatch, error)  => {
  alert('Autenticazione fallita')
  dispatch({ type: LOGIN_USER_FAIL, payload: error })


}

const signupUserSuccess = (dispatch, email,password, navigateBack) => {
  dispatch({type: SIGNUP_USER_SUCCESS})
  loginUser([email, password, navigateBack])
  navigateBack()
  //alert("Registrazione effettuata con successo, procedi ora con il login")
}

const signupUserFailed= (dispatch,error) => {
  alert(error)
}

export const SignUpUser= ({email,password,navigateToBack}) => {
  return (dispatch) => {
    dispatch({ type: SIGNUP_USER_START });
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => signupUserSuccess(dispatch,email,password,navigateToBack))
    .catch((error) =>{ signupUserFailed(dispatch,error) });
  }


}


export const logoutUser = (dispatch) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER_LOGOUT})
  }
}

export const userProfileInformation = (dispatch) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    dispatch({type: USER_PROFILE_INFORMATION, payload: currentUser})
  }
}


export const setUserLocation = (coordinates) => {
  return (dispatch) =>{
    dispatch({type: USER_SET_LOCATION, payload: coordinates})
  }
}


export const setUserMarker = (coordinates) => {
  return (dispatch) =>{
    dispatch({type: USER_SET_MARKER, payload: coordinates})
  }
}


export const findListFetch = () => {
  return (dispatch) => {
      dispatch({type: FINDLIST_FETCH_START})

    firebase.database().ref("/DataList")
    .on("value", snap => {
        ArrayReturn = new Array()
        snap.forEach((child) => {
            let valPush = child.val()
            valPush.key = child.key
            ArrayReturn.push(valPush)
        })
        console.log('Array return of findlistfetch');
        console.log(ArrayReturn)
        dispatch({type: FINDLIST_FETCH_SUCCESS, payload: ArrayReturn})
    })
  }
}

export const findCreate = ({ title, location, duedate, descr, images ,latitudeMarker,longitudeMarker, navigateBack}) => {
    return (dispatch) => {
        dispatch({type: FIND_ADD_START})
        const { currentUser } = firebase.auth();
        idUser=currentUser.uid
        navigateBack('MainScreen');

        let formData = new FormData();
        for (image in images){

            var localUri = images[image];
            var filename = localUri.split('/').pop();
            // Infer the type of the image
            var match = /\.(\w+)$/.exec(filename);
            var type = match ? `image/${match[1]}` : `image`;
            formData.append('photo', { uri: localUri, name: filename, type });
        }

        fetch('http://188.213.170.165:8050/insert', {
            method: 'POST',
            body: formData,
            header: {
                'content-type': 'multipart/form-data',
            },
        })
        .then( response => response.json())
        .then( images => {
            firebase.database().ref(`/DataList`)
            .push({idUser, title, location, duedate, descr,images,latitudeMarker,longitudeMarker})
            .then((data) => {
                dispatch({type: FIND_ADD_SUCCESS})
            })

        })
        .catch(error => dispatch({type: FIND_ADD_ERROR}));
    }

}
export const findRemove = ({key, navigateBack}) => {
    console.warn(key)
    console.log('ref: '+firebase.database().ref('/DataList').child(key));
    const{ currentUser } = firebase.auth();
    console.log('ref: '+firebase.database().ref('/DataList').child(key));
    firebase.database().ref('/DataList').child(key).remove()
    .then(data => {
        console.log('REMOVED SUCCESFULLY')
        return (dispatch) => {
            dispatch({type: FINDLIST_FETCH_START})
          firebase.database().ref("/DataList")
          .on("value", snap => {
              ArrayReturn = new Array()
              snap.forEach((child) => {
                  let valPush = child.val()
                  valPush.key = child.key
                  ArrayReturn.push(valPush)
              })

              dispatch({type: FIND_REMOVE, payload: ArrayReturn})
          })
        }


    })
    .catch(data => {
        console.log('error')
    })
    navigateBack()


}
export const reportCreate = ({ email, telefono, descr, date, latitudeMarker,longitudeMarker, idFind, navigateBack}) => {
  navigateBack();
  return (dispatch) => {
      dispatch({type: REPORT_ADD_START})
      firebase.database().ref(`/ReportList`)
        .push({idFind,email, telefono, descr, date, descr,latitudeMarker,longitudeMarker})
        .then((data) => {
          firebase.database().ref('/DataList').on("value", snap => {
            var IdUserGet=snap.val()[idFind]['idUser']
            var TitleGet= snap.val()[idFind]['title']
            firebase.database().ref("/TokenUser")
            .on("value", snap => {
              snap.forEach((child) => {
                if(child.val().idUser === IdUserGet){
                  var TokenGet=child.val().token
                    fetch('https://exp.host/--/api/v2/push/send', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'accept-encoding': 'gzip, deflate'
                      },
                      body: JSON.stringify([{
                        to :'ExponentPushToken['+TokenGet+']',
                        sound: "default",
                        body: "Hai recevuto una segnalazione per: "+TitleGet,
                        data: { title: TitleGet}
                      }]),
                    });
                }
              })
            })
          })
          dispatch({type: REPORT_ADD_SUCCESS})
        })
  }
}

export const fetchListReport = (key) => {
    return (dispatch) => {
        dispatch({type: REPORT_FETCH_START})
        firebase.database().ref("/ReportList")
        .on("value", snap => {
            let ArrayReturn = new Array()
            snap.forEach((child) => {
                if(child.val().idFind === key){
                    ArrayReturn.push(child.val())
                }
            })
            fetchListReportSuccess(dispatch, ArrayReturn)
        })
    }
}

export const fetchListReportSuccess = (dispatch, reportData) => {
    dispatch({type: REPORT_FETCH_SUCCESS, payload: reportData})
}
