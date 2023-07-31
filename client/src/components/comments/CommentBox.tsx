import React, { useState, useEffect, useRef } from "react";
import classes from "./CommentBox.module.scss";

const CommentBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // The value of the textarea
  const [value, setValue] = useState<String>();

  // This function is triggered when textarea changes
  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className={classes.textArea__container}>
      <p>Write a comment</p>
      <textarea
        ref={textareaRef}
        className={classes.textarea__defaultstyle}
        onChange={textAreaChange}>
        {value}
      </textarea>
      <button className={classes.textarea__btn}>Comment</button>
    </div>
  );
};

export default CommentBox;
