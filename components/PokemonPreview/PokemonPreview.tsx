import React, { useContext, useState, ReactElement } from "react";
import Image from "next/image";

import classes from "./PokemonPreview.module.css";

export interface IPokemonPreview {
  id: number;
  pokemonType: string;
  name: string;
  height: number;
  weight: number;
  sprite: string;
}

const PokemonPreview: React.FC<IPokemonPreview> = ({ id, name, height, pokemonType, sprite, weight }): ReactElement => {
  return (
    <div className={classes.pokedexContainer}>
      <h2 className={classes.pokemonName}>{name}</h2>
      <div className={classes.pokedexImageContainer}>
        <Image layout="fill" src={sprite} />
      </div>
      <div className={classes.divTable}>
        <div className={classes.divTableBody}>
          <div className={classes.divTableRow}>
            <div className={classes.divTableCell}>Type</div>
            <div className={classes.divTableCell}>{pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1)}</div>
          </div>
          <div className={classes.divTableRow}>
            <div className={classes.divTableCell}>Height</div>
            <div className={classes.divTableCell}>{`${height * 10} cm`}</div>
          </div>
          <div className={classes.divTableRow}>
            <div className={classes.divTableCell}>Weight</div>
            <div className={classes.divTableCell}>{`${weight / 10} kg`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PokemonPreview;
