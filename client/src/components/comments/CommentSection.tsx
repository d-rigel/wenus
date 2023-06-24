import React from "react";
import classes from "./CommentSection.module.scss";
import CommentBox from "./CommentBox";
import Comments from "./Comments";

const CommentSection = () => {
  return (
    <div className={classes.comment__section}>
      <Comments />
      <CommentBox />
    </div>
  );
};

export default CommentSection;
