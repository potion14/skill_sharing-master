import classes from '../comboboxes/Combobox.module.css';

export default function CategoriesDropdownListElement(props) {

    function handleClick(item, event, type) {
        event.preventDefault();
        props.getData(item, type);
    }

    return (
        <a onClick={(e) => handleClick(props.category, e, props.type)} className={classes.le}>{props.category.name}</a> 
    )
}