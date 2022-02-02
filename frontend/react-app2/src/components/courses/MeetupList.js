import MeetupItem from './MeetupItem';
import CourseCard from '../ui/CourseCard'

import classes from './MeetupList.module.css';

function MeetupList(props) {
    return (
    <div className={classes.listContainer}>
        <ul className={classes.list}>
            <li className={classes.listItem}>
                {props.courses.map(course => <CourseCard 
                key={course.id} 
                id={course.id} 
                image={course.image}
                title={course.title}
                buttonText="zapisz"
                page={props.page}/>)}
            </li>
        </ul>
    </div>
    );
}

export default MeetupList;