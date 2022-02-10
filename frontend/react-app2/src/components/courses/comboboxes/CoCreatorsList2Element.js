import classes from './CoCreatorsList2Element.module.css';
import axios from 'axios'

export default function CoCreatorsList2Element(props) {

    function handleClick(user, e) {
        e.preventDefault();
        //console.log("kliknięcie: ", email)
        props.sendedFunction(user);
        const url ='http://127.0.0.1:8000/api/v1/user-info-in-course/user/' + props.user.id + '/course/' + props.courseID + '/'
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }
        }).then(res => {
            const url1 = 'http://127.0.0.1:8000/api/v1/delete-co-creator/' + res.data.user_co_creator_id + '/'
            axios.delete(url1, {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                }
            })
        })
    }

    return (
        <div className={classes.wrapper} onClick={(e) => handleClick(props.user, e)}>
            <a>{props.user.email}</a>
        </div>
    )
} 