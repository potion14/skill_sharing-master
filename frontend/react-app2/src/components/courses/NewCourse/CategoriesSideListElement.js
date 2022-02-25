import classes from '../comboboxes/CoCreatorsList2Element.module.css';

export default function CategoriesSideListElement(props) {

    function handleClick(item, e, type) {
        e.preventDefault();
        props.remove_data(item, type);
    }

    return (
        <div className={classes.wrapper} onClick={(e) => handleClick(props.sub, e, props.type)}>
            <a>{props.sub.name}</a>
        </div>
    )
} 