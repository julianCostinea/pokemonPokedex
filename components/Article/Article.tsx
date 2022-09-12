import React, { useContext, useState } from "react";

import classes from "./Article.module.css";

interface IProps {
    id: string,
    title: string
}

const Article:React.FC<IProps> = ({id, title}) => {
  return (
    <>
      <article className={classes.recommendation} id={id}>
        <h2 className={classes.recommendationTitle}>{title}</h2>
        <section>

        </section>
      </article>
    </>
  );
};
export default Article;
