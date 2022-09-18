import React, { useState, useEffect, ReactElement, useRef, MutableRefObject } from "react";
import Head from "next/head";
import axios, { AxiosResponse } from "axios";

import styles from "@/pages/index.module.css";
import type { NextPage } from "next";
import PokemonItem from "@/components/PokemonItem/PokemonItem";

export interface fetchedPokemons {
  results: {
    url: string;
    name: string;
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
}

const Home: NextPage = () => {
  const randomPokemonNumber = Math.floor(Math.random() * 152);
  const [errorHeader, setErrorHeader] = useState<string>("");
  const [items, setItems] = useState<fetchedPokemons["results"]>([]);
  const [pokemon, setPokemon] = useState<string>("Pikachu");
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [pokemonType, setPokemonType] = useState<string>("");
  const searchTermInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  let pokemons: ReactElement[] = [];

  async function axiosGetJsonData<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error in 'axiosGetJsonData(${url})': ${error.message}`);
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    const pokemonQuery = searchTermInputRef.current.value.trim() as string;
    const newPokemon = await axiosGetJsonData<Pokemon>(
      `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`
    );
    console.log(newPokemon.id);
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

  useEffect(() => {
    try {
      const fetchPokemon = async () => {
        const fetchResponse = await axiosGetJsonData<fetchedPokemons>(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        setItems(fetchResponse.results);
      };
      fetchPokemon();
    } catch (error: any) {
      setErrorHeader(error);
    }
  }, []);

  pokemons = items
    .slice(randomPokemonNumber, randomPokemonNumber + 20)
    .map((pokemon) => {
      return (
        <PokemonItem url={pokemon.url} name={pokemon.name} key={pokemon.url} />
      );
    });

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              ref={searchTermInputRef}
              type="text"
              placeholder="enter pokemon name"
            />
          </label>
        </form>
        <h1 className={styles.title}>Other popular pokemon</h1>
        <h2>{errorHeader}</h2>
        <div className={styles.pokemonContainer}>{pokemons}</div>
      </main>
    </div>
  );
};
export default Home;
