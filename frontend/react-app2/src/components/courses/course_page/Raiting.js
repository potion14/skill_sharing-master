import classes from "./Rating.module.css";
import Star from '@material-ui/icons/Star';
import { useState } from "react";
import StarBorder from "@material-ui/icons/StarBorder";

export default function Raiting(props) {

    const [rating, setRaiting] = useState([1,2,3,4,5]);
    const [currentRating, setCurrentRaiting] = useState(0);
    const [currentRaitingText, setcurrentRaitingText] = useState("");

    function handleClick(e, index) {
        e.preventDefault();
        console.log("current raiting: ", index)
        //console.log("current raiting tekst: ", currentRaitingText)
        setCurrentRaiting(index);
        props.getRating(index, currentRaitingText)
    }

    function textareaChanged(e) {
        setcurrentRaitingText(e.target.value)
        console.log("current raiting tekst: ", currentRaitingText)
        props.getRating(currentRating, e.target.value)
    }

    return (
        <div className={classes.chaptersContainer}>
            <label className={classes.chaptersLabel}>Rate Course</label>
            <hr className={classes.chaptersHr}></hr>
            <div>
                {
                    currentRating === 0 ?
                    rating.map((i, index) => <StarBorder key={index} onClick={(e) => {handleClick(e, index + 1)}} />) :
                    rating.map((i, index) => {
                        return currentRating >= index + 1 ? <Star key={index} onClick={(e) => {handleClick(e, index + 1)}} /> : 
                        <StarBorder key={index} onClick={(e) => {handleClick(e, index + 1)}} />
                    })
                }
            </div>
            <textarea rows="3" placeholder="Leave feedback" onChange={(e) => {textareaChanged(e)}}></textarea>
        </div>
    )
}