import classes from './Combobox.module.css';
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import CoCreatorsListElement from './CoCreatorsListElement';
import CoCreatorsList2Element from './CoCreatorsList2Element';

export default function CoCreatorsCombo(props) {
    const [comboUsers, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(props.existingCoCreators);
    const [selectedUsersIds, setIds] = useState([]);
    const [recievedCocreators, setRecieved] = useState([]);
    const [loading, setLoading] = useState(false);

    const url = 'http://127.0.0.1:8000/api/v1/users'

    useEffect(() => {
        axios.get(url, {
            auth: {
            username: localStorage.getItem('username'), 
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setUsers(res.data)
            var array = [...res.data]
            props.existingCoCreators.forEach(element => {
                var index = array.findIndex(object => object.email === element.email)
                array.splice(index, 1)
                setUsers(array)
            });
            setLoading(false)
        });
    }, [])
    
    

    function getSelectedUser(user) {
        setSelectedUsers(prevState => ([...prevState, user]))
        setIds(prevState => ([...prevState, user.id]))
        var array = [...comboUsers]
        var index = array.findIndex(object => object.email === user.email)
        array.splice(index, 1)
        setUsers(array)
        props.getData(selectedUsers);
        console.log("usersi: ", selectedUsersIds)
    }

    function removeSelectedUser(user) {
        var array = [...selectedUsers]
        var idsarray = [...selectedUsersIds]
        var index = array.findIndex(object => object.email === user.email)
        if (index !== -1) {
            array.splice(index, 1);
            setSelectedUsers(array)
            idsarray.splice(index, 1);
            setIds(idsarray);
            setUsers(prevState => ([...prevState, user]))
          }
          props.getData(selectedUsers);
          console.log("usersi: ", selectedUsersIds)
    }

    if (loading === true) return (<div className={classes.loadingContainer}>
            <div className={classes.loadingImage}/>
        </div>)
    if (loading === false)
    {
        return (
            <div className={classes.CoCreatorsContainer}>
                <div className={classes.container}>
                    <div className={classes.accountButtonWrapper} data-dropdown>
                        <button className={classes.profileButton} data-dropdown-button type='button'>Select CoCreator</button>
                        <div className={classes.dropdownMenu}>
                            {
                                comboUsers.map((e, index) => <CoCreatorsListElement getData={getSelectedUser}
                                key={index} user={e} id={index} courseID={props.courseID}></CoCreatorsListElement>)
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.container2}>
                    {
                        props.existingCoCreators !== [] ?
                        <div>
                            {
                                selectedUsers.map((e, index) => <CoCreatorsList2Element sendedFunction={removeSelectedUser}
                                user={e} key={index} courseID={props.courseID}></CoCreatorsList2Element>)
                            }
                        </div> : null
                    }
                </div>
            </div>
        )
    }
}