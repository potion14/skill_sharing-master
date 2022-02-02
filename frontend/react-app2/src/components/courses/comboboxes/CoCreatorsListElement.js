import classes from './Combobox.module.css';

export default function CoCreatorsListElement(props) {

    function handleClick(email, event) {
        event.preventDefault();
        props.getData(email);
        // console.log("kliknięcie: ", email)
    }

    return (
        <a onClick={(e) => handleClick(props.user, e)}>{props.user}</a>
    )
}