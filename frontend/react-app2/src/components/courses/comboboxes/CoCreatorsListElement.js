import classes from './Combobox.module.css';

export default function CoCreatorsListElement(props) {

    function handleClick(user, event) {
        event.preventDefault();
        props.getData(user);
        // console.log("kliknięcie: ", email)
    }

    return (
        <a onClick={(e) => handleClick(props.user, e)}>{props.user.email}</a>
    )
}