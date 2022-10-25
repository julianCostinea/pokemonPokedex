import React, { useContext, useState, ReactElement } from "react";
import Image from "next/image";
import useSWR from "swr";
import classes from "../PokemonPreview/PokemonPreview.module.css";
import { Pokemon } from "../../pages/fromuseswr";
import axios from "axios";

interface IProps {
  pokemonQuery: string;
}

const PokemonPreviewWithSwr: React.FC<IProps> = ({ pokemonQuery }): ReactElement => {
  const fetcher = async (url: string) => await axios.get<Pokemon>(url).then((res) => res.data);
  const { isValidating, data, error } = useSWR<Pokemon, Error>(
    `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`,
    fetcher
  );

  return (
    <>
      {isValidating && !error ? <div>Loading...</div> : null}
      {error ? <div>{error.message}</div> : null}

      {!data?.name && !isValidating && !error ? (
        <div>No Data to Show</div>
      ) : data ? (
        <div className={classes.pokedexContainer}>
          <h2 className={classes.pokemonName}>{data?.name}</h2>
          <div className={classes.pokedexImageContainer}>
            <Image layout="fill" src={data?.sprites.front_default} alt={"Pokemon Image"} />
          </div>
          <div className={classes.divTable}>
            <div className={classes.divTableBody}>
              <div className={classes.divTableRow}>
                <div className={classes.divTableCell}>Type</div>
                <div className={classes.divTableCell}>{data?.types[0].type.name}</div>
              </div>
              <div className={classes.divTableRow}>
                <div className={classes.divTableCell}>Height</div>
                <div className={classes.divTableCell}>{`${data?.height * 10} cm`}</div>
              </div>
              <div className={classes.divTableRow}>
                <div className={classes.divTableCell}>Weight</div>
                <div className={classes.divTableCell}>{`${data?.weight / 10} kg`}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default PokemonPreviewWithSwr;
