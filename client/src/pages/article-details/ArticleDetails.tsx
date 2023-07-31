import React from "react";
import MainLayout from "../../layout/MainLayout";
import Card from "../../components/UI/card/Card";
import classes from "./ArticleDetails.module.scss";
import CommentSection from "../../components/comments/CommentSection";
import staticImages from "../../constants/static-images";

const ArticleDetails = () => {
  return (
    <MainLayout>
      <Card>
        <div className={classes.detail__container}>
          <div className={classes.section}>
            <h3 className={classes.title}>Article title</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing.
              Exercitationem cum error laboriosam cumque quod enim? Aperiam
              fuga, doloremque sint numquam perferendis, debitis ducimus earum
              quis rerum pariatur totam, ad sapiente.
            </p>
            <h5>Created by</h5>
            <p>6 hour ago</p>
            <hr />
            <div className={classes.comments__container}>
              <CommentSection />
            </div>
          </div>
          <div className={classes.image__section}>
            <img className="" src={staticImages.iphone} alt="comment" />
            <div className="buttons">
              <input type="button" className={classes.edit__btn} value="Edit" />
            </div>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default ArticleDetails;
