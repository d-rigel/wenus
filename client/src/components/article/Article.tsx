import React from "react";
import Card from "../UI/card/Card";
import staticImages from "../../constants/static-images";
import classes from "./Article.module.scss";

const Article: React.FC = () => {
  return (
    <div className={classes.article_container}>
      <Card>
        <div className={classes.img_wrapper}>
          <img
            className={classes.article_image}
            src={staticImages.iphone}
            alt="static_image"
          />
        </div>
        <div className={classes.overlay}>
          <div className={classes.time_overlay}>
            <p className={classes.time}>5 hours ago</p>
            <p className={classes.elipses}>...</p>
          </div>
        </div>
        <div className={classes.article_title}>
          <p>Post title</p>
        </div>
      </Card>
    </div>
  );
};

export default Article;
