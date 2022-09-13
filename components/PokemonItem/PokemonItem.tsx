import React, { useContext, useState, ReactElement } from "react";

import classes from "./PokemonItem.module.css";

export interface IProps {
    url: string,
    name: string,
}

const pokemonItem:React.FC<IProps> = ({url, name}): ReactElement => {
  return (
    <>
      <article data-testid = "pokemon" className={classes.pokemonItem} key={url}>
        <h2 className={classes.pokemonItemTitle}>{name}</h2>
        <section>
          <p>{}</p>
        </section>
      </article>
    </>
  );
};
export default pokemonItem;
