import classes from './Combobox.module.css';
import axios from 'axios';

export default function CoCreatorsListElement(props) {

    function handleClick(user, event) {
        event.preventDefault();
        props.getData(user);
        axios.post('http://127.0.0.1:8000/api/v1/new_course_co_creator/', {
            course: props.courseID,
            co_creator: props.user.id,
            is_active: true
        }, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }});
    }

    return (
        <a onClick={(e) => handleClick(props.user, e)}>{props.user.email}</a>
    )
}