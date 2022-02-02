import classes from './Search.module.css';

const Search = () => {
    return (
        <div className={classes.searchBar}>
            <input placeholder="Search" className={classes.searchBarInput}></input>
        </div>
    );
}

export default Search;