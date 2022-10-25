import React, { useState, useEffect, ReactElement, useRef, MutableRefObject } from "react";
import Head from "next/head";
import axios from "axios";
import useSWR from "swr";

import styles from "./index.module.css";
import type { NextPage } from "next";
import PokemonPreview from "../components/PokemonPreview/PokemonPreview";
import PokemonList from "../components/PokemonList/PokemonList";

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
  const [errorHeader, setErrorHeader] = useState("");
  const [pokemonQuery, setPokemonQuery] = useState("");
  const searchTermInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const fetcher = async (url: string) => await axios.get<Pokemon>(url).then((res) => res.data);

  const { data, error } = useSWR<Pokemon, Error>(pokemonQuery ? `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}` : null, fetcher);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    setErrorHeader("");

    if (!searchTermInputRef.current.value) {
      setErrorHeader("Enter a valid pokemon name");
      return;
    }
    setPokemonQuery(searchTermInputRef.current.value.toLowerCase().trim());
  };

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
        <h2 style={{ color: "red" }}>{error?.message}</h2>
        {data ? (
          <PokemonPreview
            weight={data.weight}
            name={data.name}
            height={data.height}
            id={data.id}
            pokemonType={data.types[0].type.name}
            sprite={data.sprites.front_default}
            key={data.id}
          />
        ) : "Loading..."}
        <h1 className={styles.title}>Other popular pokemon</h1>
        <PokemonList />
      </main>
    </div>
  );
};
export default Home;
