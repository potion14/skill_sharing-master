import classes from '../comboboxes/Combobox.module.css';

export default function CategoriesDropdownListElement(props) {

    function handleClick(item, event, type) {
        event.preventDefault();
        props.getData(item, type);
        // console.log("kliknięcie: ", email)
    }

    return (
        <a onClick={(e) => handleClick(props.category, e, props.type)}>{props.category.name}</a>
    )
}