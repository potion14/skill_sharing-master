import classes from './NewCourseForm.module.css';

export default function Alert() {



    return <div className={classes.AlertWindow}>
        <span className={classes.alertContent}>You left some empty fields!</span>
    </div>
}