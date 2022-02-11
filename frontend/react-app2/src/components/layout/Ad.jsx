import classes from "./Ad.module.css"

function Ad() {
    return(
        <div className={classes.ad}>
            <img src="https://k48b9e9840-flywheel.netdna-ssl.com/wp-content/uploads/2021/07/alfons-morales-YLSwjSy7stw-unsplash.jpg" alt="" className={classes.adImg} />
            <div className={classes.adTextContainer}>
                <span className={classes.adTitle}>Ad title</span>
                <span className={classes.adText}>Ad content</span>
            </div>
        </div>
    );
}

export default Ad;