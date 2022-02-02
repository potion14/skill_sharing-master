import Card from '../ui/Card';
import classes from './MeetupItem.module.css';
import { useHistory } from 'react-router-dom';

function MeetupItem(props) {

    const history = useHistory();

    function handleClick(e) {
        e.preventDefault();
        history.push("/course");
    }

    return (
        <Card>
        <div className={classes.image}>
            <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
        </div>
        <div className={classes.actions}>
            <button onClick={handleClick}>Sign up</button>
        </div>
        </Card>
    );
}

export default MeetupItem;