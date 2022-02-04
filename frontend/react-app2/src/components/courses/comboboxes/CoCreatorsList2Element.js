import classes from './CoCreatorsList2Element.module.css';

export default function CoCreatorsList2Element(props) {

    function handleClick(user, e) {
        e.preventDefault();
        //console.log("kliknięcie: ", email)
        props.sendedFunction(user);
        //props.removeId(id)
        //console.log("klikniete id: ", id)
    }

    return (
        <div className={classes.wrapper} onClick={(e) => handleClick(props.user, e)}>
            <a>{props.user.email}</a>
        </div>
    )
} 