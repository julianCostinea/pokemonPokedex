import React, { useState, useEffect, ReactElement, useRef, MutableRefObject } from "react";
import Head from "next/head";
import axios from "axios";

import styles from "@/pages/index.module.css";
import type { NextPage } from "next";
import PokemonPreview from "@/components/PokemonPreview/PokemonPreview";
import PokemonList from "@/components/PokemonList/PokemonList";

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

  async function axiosGetJsonData<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error in 'axiosGetJsonData(${url})': ${error.message}`);
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
    setErrorHeader("");
    evt.preventDefault();
    if (!searchTermInputRef.current.value) {
      setErrorHeader("Enter a valid pokemon name");
      return;
    }
    const pokemonQuery = searchTermInputRef.current.value.toLowerCase().trim() as string;
    const newPokemon = await axiosGetJsonData<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`);
    setPokemonPreviewData(newPokemon);
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
            <input ref={searchTermInputRef} type="text" placeholder="Enter pokemon name" />
          </label>
        </form>
        <h2 style={{ color: "red" }}>{errorHeader}</h2>
        {pokemonPreviewData && (
          <PokemonPreview
            weight={pokemonPreviewData.weight}
            name={pokemonPreviewData.name}
            height={pokemonPreviewData.height}
            id={pokemonPreviewData.id}
            pokemonType={pokemonPreviewData.types[0].type.name}
            sprite={pokemonPreviewData.sprites.front_default}
            key={pokemonPreviewData.id}
          />
        )}
        <h1 className={styles.title}>Other popular pokemon</h1>
        <PokemonList/>
      </main>
    </div>
  );
};
export default Home;
