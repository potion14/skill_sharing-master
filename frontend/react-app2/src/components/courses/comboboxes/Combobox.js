import classes from './Combobox.module.css';
import axios from "axios";

export default function Combobox(props) {

    axios.get(url, {
        auth: {
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        password: localStorage.getItem('password')
        }
    })
    .then(res => {
        console.log("res.data: ", res.data)
        SetChapters({
            list: res.data
        });
    });

    return (
        <div className={classes.accountButtonWrapper} data-dropdown>
            <button className={classes.profileButton} data-dropdown-button>Hello, {localStorage.getItem("username")}</button>
            <div className={classes.dropdownMenu}>
                {

                }
            </div>
        </div>
    )
}