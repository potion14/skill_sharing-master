import classes from "./CoursePageLayout.module.css";
import Star from '@material-ui/icons/Star';
import { useState } from "react";
import StarBorder from "@material-ui/icons/StarBorder";

export default function Raiting(props) {

    const [raiting, setRaiting] = useState([1,2,3,4,5]);
    const [currentRaiting, setCurrentRaiting] = useState(0);

    function handleClick(e, index) {
        e.preventDefault();
        console.log("current raiting: ", index)
        setCurrentRaiting(index);
        props.getRating(index)
    }

    return (
        <div className={classes.chaptersContainer}>
            <label className={classes.chaptersLabel}>Rate Course</label>
            <hr className={classes.chaptersHr}></hr>
            <div>
                {
                    currentRaiting === 0 ?
                    raiting.map((i, index) => <StarBorder key={index} onClick={(e) => {handleClick(e, index + 1)}} />) :
                    raiting.map((i, index) => {
                        return currentRaiting >= index + 1 ? <Star key={index} onClick={(e) => {handleClick(e, index + 1)}} /> : 
                        <StarBorder key={index} onClick={(e) => {handleClick(e, index + 1)}} />
                    })
                }
            </div>
        </div>
    )
}