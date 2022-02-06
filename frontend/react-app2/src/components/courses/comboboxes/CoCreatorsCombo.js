import classes from './Combobox.module.css';
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import CoCreatorsListElement from './CoCreatorsListElement';
import CoCreatorsList2Element from './CoCreatorsList2Element';

export default function CoCreatorsCombo(props) {
    const [comboUsers, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUsersIds, setIds] = useState([]);
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
            setLoading(false)
        });
    }, [])
    
    function getSelectedUser(user) {
        setSelectedUsers(prevState => ([...prevState, user]))
        setIds(prevState => ([...prevState, user.id]))
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
            setIds(idsarray)
          }
          console.log("usersi: ", selectedUsersIds)
    }

    props.getData(selectedUsers);

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
                                key={index} user={e} id={index} ></CoCreatorsListElement>)
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.container2}>
                    {
                        selectedUsers.map((e, index) => <CoCreatorsList2Element sendedFunction={removeSelectedUser}
                        user={e} key={index}></CoCreatorsList2Element>)
                    }
                </div>
            </div>
        )
    }
}