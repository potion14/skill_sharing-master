import classes from "./LoginRegisterLayout.module.css"
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import React, { useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import Login from "./loginRegister/Login";
import Register from "./loginRegister/Register";
//import { Spin, Icon, Spin } from 'antd';

//const antIcon = <Icon type="loading" style={{fontSize: 24}} spin />
//<Spin indicator={antIcon}


function LoginRegisterLayout(props) {

    const history = useHistory();

    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [loginOrRegister, setLRLState] = useState();

    function handleSubmit(e) {
        e.preventDefault();
        setLRLState("login");
        props.onAuth(usernameInputRef.current.value, emailInputRef.current.value, passwordInputRef.current.value);
        history.push("/");
    }

    function handleSubmitRegister(e) {
        e.preventDefault();
        setLRLState("register");
        props.onAuth(usernameInputRef.current.value, emailInputRef.current.value, passwordInputRef.current.value);
        history.push("/");
    }

    return(
        <div className={classes.mainDiv}>
            <div className={classes.loginRegisterLayoutContainer}>
                <Login />
                <Register />
            </div>
        </div>
    )
}

export default LoginRegisterLayout;