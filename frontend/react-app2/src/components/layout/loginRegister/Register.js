import classes from "../LoginRegisterLayout.module.css"
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/auth';
import React, { useRef, useState } from "react";
import { useHistory } from 'react-router-dom';

function LoginRegisterLayout(props) {

    const history = useHistory();

    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const password1InputRef = useRef();
    const password2InputRef = useRef();

    function handleSubmitRegister(e) {
        e.preventDefault();
        props.onAuth(usernameInputRef.current.value, emailInputRef.current.value, password1InputRef.current.value, password2InputRef.current.value);
        history.push("/");
    }

    return(
        <form className={classes.rightPanel}  onSubmit={handleSubmitRegister}>
            <div className={classes.RegisterContainer}>
                <h3 className={classes.loginTitle}>Create new account</h3>
                <div className={classes.inputField}>
                    <input placeholder="Username" className={classes.searchBarInput} required id="usernameRegistration" ref={usernameInputRef}></input>
                </div>
                <div className={classes.inputField}>
                    <input placeholder="Email" className={classes.searchBarInput} required id="emailRregistration" ref={emailInputRef}></input>
                </div>
                <div className={classes.inputField}>
                    <input placeholder="Password1" className={classes.searchBarInput} required id="password1" ref={password1InputRef} type="password"></input>
                </div>
                <div className={classes.inputField}>
                    <input placeholder="Password2" className={classes.searchBarInput} required id="password2" ref={password2InputRef} type="password"></input>
                </div>
                <button className={classes.logInButton}>Register</button>
            </div>
        </form>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegisterLayout);