import classes from "./Ad.module.css"

function Ad() {
    return(
        <div className={classes.ad}>
            <img src="https://k48b9e9840-flywheel.netdna-ssl.com/wp-content/uploads/2021/07/alfons-morales-YLSwjSy7stw-unsplash.jpg" alt="" className={classes.adImg} />
            <div className={classes.adTextContainer}>
                <span className={classes.adTitle}>To jest tytuł reklamki</span>
                <span className={classes.adText}>To jest tekst reklamki, może być on trochę dłuższy niż tytuł! Ale nie powinien wykraczać poza kontener.</span>
            </div>
        </div>
    );
}

export default Ad;