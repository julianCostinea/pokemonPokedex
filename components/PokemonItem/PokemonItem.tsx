import React, { useContext, useState, ReactElement } from "react";
import Image from "next/image";

import classes from "./PokemonItem.module.css";
import Link from "next/link";

export interface IProps {
  url: string;
  name: string;
}

const pokemonItem: React.FC<IProps> = ({ url, name }): ReactElement => {
  return (
    <Link href={`/pokemon/${url.slice(34, -1)}`}>
      <article data-testid="pokemon" className={classes.pokemonItem} key={url}>
        <div className={classes.imageContainer}>
          <Image
            src="https://images.unsplash.com/photo-1542779283-429940ce8336?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            layout="fill"
            alt="pokeBall"
          />
        </div>
        <h2 className={classes.pokemonItemTitle}>{name}</h2>
        <section>
          <p>{}</p>
        </section>
      </article>
    </Link>
  );
};
export default pokemonItem;
