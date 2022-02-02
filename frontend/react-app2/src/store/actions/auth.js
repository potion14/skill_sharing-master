import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return{
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('UserId');
    localStorage.removeItem('userPoints');
    localStorage.removeItem('JoinDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, email, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/api/v1/rest-auth/login/', {
            username: username,
            email: email,
            password: password
        })
        .then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            axios.get('http://127.0.0.1:8000/api/v1/users', {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                  }
                })
                .then(resp => {
                    console.log('Odpowiedz geta userow: ', resp.data)
                    resp.data.forEach(element => {
                        if (element.email === localStorage.getItem('email')) { 
                            localStorage.setItem("UserId", element.id);
                            console.log("curren user id: ", localStorage.getItem('UserId'));
                            localStorage.setItem("userPoints", element.points);
                            console.log(element.points);
                            localStorage.setItem("JoinDate", element.date_joined);
                            console.log(element.date_joined);
                        }
                    });
                })
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
}

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/api/v1/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(res => {
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password1);
            axios.get('http://127.0.0.1:8000/api/v1/users', {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                  }
                })
                .then(resp => {
                    console.log('Odpowiedz geta userow: ', resp.data)
                    resp.data.forEach(element => {
                        if (element.email === localStorage.getItem('email')) { 
                            localStorage.setItem("UserId", element.id);
                            console.log("curren user id: ", localStorage.getItem('UserId'));
                            localStorage.setItem("userPoints", element.points);
                            console.log(element.points);
                            localStorage.setItem("JoinDate", element.date_joined);
                            console.log(element.date_joined);
                        }
                    });
                })
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date() ) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000))
            }
        }
    }
}