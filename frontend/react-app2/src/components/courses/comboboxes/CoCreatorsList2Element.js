import classes from './CoCreatorsList2Element.module.css';

export default function CoCreatorsList2Element(props) {

    function handleClick(email, e) {
        e.preventDefault();
        //console.log("kliknięcie: ", email)
        props.sendedFunction(email);
    }

    return (
        <div className={classes.wrapper} onClick={(e) => handleClick(props.user, e)}>
            <a>{props.user}</a>
        </div>
    )
} 