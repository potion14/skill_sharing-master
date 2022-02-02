import classes from './ChapterCard.module.css';
import React, { useState } from 'react';


function ChapterCard (props) {
    var [pressed, setPressed] = useState();

    function onTrigger() {
        props.parentCallback(pressed)
    }

    function handleClick(id) {
        setPressed(id)
        console.log(id)
        onTrigger()
    }

    return (
        <div>
            {
                props.id === pressed ? <li className={classes.chaptersListPressedItem}>{props.title}</li> :
                <li className={classes.chaptersListItem} onClick={() => handleClick(props.id)}>{props.title}</li>
            }
        </div>
    )
}

export default ChapterCard;