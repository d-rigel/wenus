import React from "react";
import Card from "../UI/card/Card";
import staticImages from "../../constants/static-images";
import classes from "./Article.module.scss";
import Button from "../UI/button/Button";
// import { FaTrash, FaThumbsUp } from "react-icons/fa";
import { Icon } from "@iconify/react";

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
          <h4>Post title</h4>
        </div>
        <div className={classes.article_details}>
          <p className={classes.article_details_text}>
            Es un hecho establecido hace demasiado tiempo que un lector se
            distraerá con el contenido del texto de un sitio mientras que mira
            su diseño. El punto de usar Lorem Ipsum es que tiene una
            distribución más o menos normal de las letras, al contrario de usar
            textos como por ejemplo "Contenido aquí, contenido aquí". Estos
            textos hacen parecerlo un español que se puede leer. Muchos paquetes
            de autoedición y editores de páginas web usan el Lorem Ipsum como su
            texto por defecto, y al hacer una búsqueda de "Lorem Ipsum" va a dar
            por resultado muchos sitios web que usan este texto si se encuentran
            en estado de desarrollo. Muchas versiones han evolucionado a través
            de los años, algunas veces por accidente, otras veces a propósito
            por ejemplo insertándole humor y cosas por el estilo
          </p>
        </div>
        <div className={classes.btn__wrapper}>
          <div className={classes.btn}>
            <Button no__outlined={true}>
              <div className={classes.btn__group}>
                <div>
                  <Icon
                    className={classes.r__icon}
                    icon="dashicons:thumbs-up"
                  />
                </div>

                <p className={classes.likes__group}>
                  <span> 300 </span> Likes
                </p>
              </div>
            </Button>
          </div>
          <div className={classes.btn}>
            <Button no__outlined={true}>
              <div className={classes.btn__group}>
                <div className={classes.del__btn}>
                  <Icon className={classes.r__icon} icon="tabler:trash" />
                </div>

                <p className={classes.del__btn}>Delete</p>
              </div>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Article;
