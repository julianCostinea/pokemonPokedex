import React, { useState, useEffect, ReactElement, useRef, MutableRefObject } from "react";
import Head from "next/head";
import axios from "axios";

import styles from "./index.module.css";
import type { NextPage } from "next";
import PokemonPreview from "../components/PokemonPreview/PokemonPreview";
import PokemonList from "../components/PokemonList/PokemonList";
import PokemonPreviewWithSwr from "../components/PokemonPreviewWithSWR/PokemonPreviewWithSwr";

export interface Pokemon {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
}

const Home: NextPage = () => {
  const [errorHeader, setErrorHeader] = useState<string>("");
  const [pokemonPreviewData, setPokemonPreviewData] = useState<undefined | Pokemon>();
  const searchTermInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [pokemonQuery, setPokemonQuery] = useState("vulpix");

  async function axiosGetJsonData<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error in 'axiosGetJsonData(${url})': ${error.message}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    setErrorHeader("");

    if (!searchTermInputRef.current.value) {
      setErrorHeader("Enter a valid pokemon name");
      return;
    }
    const pokemonQuery = searchTermInputRef.current.value.toLowerCase().trim();
    setPokemonQuery(pokemonQuery);

    try {
      const newPokemon = await axiosGetJsonData<Pokemon>(`https://pokeapi.co/api/v2/psokemon/${pokemonQuery}`);
      setPokemonPreviewData(newPokemon);
    } catch (error: any) {
      console.log(error);
      
      setErrorHeader("Enter a valid pokemon from Kanto.");
    }
  };

  // function handleSubmit(event: React.FormEventHandler<HTMLFormElement>){
  //   event.preventDefault();
  //   // const target = event.target as HTMLInputElement;
  //   // console.log('====================================');
  //   // console.log(target.value);
  //   // console.log('====================================');
  // }

  // const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
  //   evt.preventDefault();
  //   setPokemon(evt.target.value.toLowerCase());
  // };

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Kanto Pokedex</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Pokemon:
            <input ref={searchTermInputRef} type="text" />
          </label>
          <button>Search pokemon</button>
        </form>
        <h2 style={{ color: "red" }}>{errorHeader}</h2>
        {/* {pokemonPreviewData && (
          <PokemonPreview
            weight={pokemonPreviewData.weight}
            name={pokemonPreviewData.name}
            height={pokemonPreviewData.height}
            id={pokemonPreviewData.id}
            pokemonType={pokemonPreviewData.types[0].type.name}
            sprite={pokemonPreviewData.sprites.front_default}
            key={pokemonPreviewData.id}
          />
        )} */}
        {<PokemonPreviewWithSwr pokemonQuery={pokemonQuery} />}
        <h1 className={styles.title}>Other popular pokemon</h1>
        <PokemonList />
      </main>
    </div>
  );
};
export default Home;
