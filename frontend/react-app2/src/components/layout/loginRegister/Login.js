import classes from "../LoginRegisterLayout.module.css"
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/auth';
import React, { useRef } from "react";
import { useHistory } from 'react-router-dom';

function LoginRegisterLayout(props) {

    const history = useHistory();

    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.onAuth(usernameInputRef.current.value, emailInputRef.current.value, passwordInputRef.current.value);
        history.push("/");
    }

    return(
        <form className={classes.leftPanel} onSubmit={handleSubmit}>
            <div className={classes.logInContainer}>
                <h3 className={classes.loginTitle}>Log in to access your account</h3>
                <div className={classes.inputField}>
                    <input placeholder="Username" className={classes.searchBarInput} required id="usernameL" ref={usernameInputRef}></input>
                </div>
                <div className={classes.inputField}>
                    <input placeholder="Email" className={classes.searchBarInput} required id="email" ref={emailInputRef}></input>
                </div>
                <div className={classes.inputField}>
                    <input placeholder="Password" className={classes.searchBarInput} required id="password" ref={passwordInputRef} type="password"></input>
                </div>
                <span className={classes.forgotPassword}>Forgot password</span>
                <button className={classes.logInButton}>Login</button>
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
        onAuth: (username, email, password) => dispatch(actions.authLogin(username, email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegisterLayout);