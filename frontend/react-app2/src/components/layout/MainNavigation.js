import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';

import classes from './MainNavigation.module.css';
import Search from './Search';
//import useScript from '../../hooks/useScript';

function MainNavigation(props) {
    //useScript('./scriptt.jsx');

    return ( 
    <header className={classes.header}>
        <div className={classes.logo}><Link to='/'>Home Page</Link></div>
        <nav>
            <ul>
                <li>
                    <Search />
                </li>
                <li>
                    <Link className={classes.link} to='/all-courses'>All Courses</Link>
                </li>
                <li>
                    {
                    props.isAuthenticated ?
                    <Link className={classes.link} to='/new-course'>Add New Course</Link> : null }
                </li>
                <li>
                {
                    props.isAuthenticated ?
                    <Link className={classes.link} to='/user_courses'>My Courses</Link> : null
                }
                </li>
                <li>
                    {
                        props.isAuthenticated ?
                        <div className={classes.accountButtonWrapper} data-dropdown>
                            <button className={classes.profileButton} data-dropdown-button>Hello, {localStorage.getItem("username")}</button>
                            <div className={classes.dropdownMenu}>
                                <Link className={classes.link} to='/' className={classes.loginOrRegister} onClick={props.logout}>Logout</Link>
                                <hr></hr>
                                <Link className={classes.link} to='/user-profile' className={classes.loginOrRegister}>Profile</Link>
                            </div>
                        </div> :
                        <div className={classes.dropdownLinkLR}>
                            <Link className={classes.link} to='/login-register'>Login/Register</Link>
                        </div>
                    }
                </li>
            </ul>
        </nav>
    </header>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToProps)(MainNavigation);