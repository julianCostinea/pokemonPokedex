import React, {
  useState,
  useEffect,
  ReactElement,
  useRef,
  MutableRefObject,
} from "react";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";

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
  const randomPokemonNumber = Math.floor(Math.random() * 152);
  const [errorHeader, setErrorHeader] = useState<string>("");
  const [items, setItems] = useState<fetchedPokemons["results"]>([]);
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
    setErrorHeader("");
    evt.preventDefault();
    if (!searchTermInputRef.current.value) {
      setErrorHeader("Enter a valid pokemon name");
      return;
    }
    let pokemonArray = [];
    const pokemonQuery = searchTermInputRef.current.value
      .toLowerCase()
      .trim() as string;
    const newPokemon = await axiosGetJsonData<Pokemon>(
      `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`
    );
    pokemonArray.push(newPokemon);
    setPokemonType(newPokemon.types[0].type.name);
    setPokemonData(pokemonArray);
    console.log(newPokemon);
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
    .slice(randomPokemonNumber-5, randomPokemonNumber + 15)
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
        <h1>Kanto Pokedex</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              ref={searchTermInputRef}
              type="text"
              placeholder="Enter pokemon name"
            />
          </label>
        </form>
        <h2 style={{ color: "red" }}>{errorHeader}</h2>
        {pokemonData.map((data) => {
          return (
            <div key={data.id} className={styles.pokedexContainer}>
              <div className={styles.pokedexImageContainer}>
                <Image layout="fill" src={data.sprites.front_default} />
              </div>
              <div className={styles.divTable}>
                <div className={styles.divTableBody}>
                  <div className={styles.divTableRow}>
                    <div className={styles.divTableCell}>Type</div>
                    <div className={styles.divTableCell}>
                      {pokemonType.charAt(0).toUpperCase() +
                        pokemonType.slice(1)}
                    </div>
                  </div>
                  <div className={styles.divTableRow}>
                    <div className={styles.divTableCell}>Height</div>
                    <div className={styles.divTableCell}>{`${
                      data.height * 10
                    } cm`}</div>
                  </div>
                  <div className={styles.divTableRow}>
                    <div className={styles.divTableCell}>Weight</div>
                    <div className={styles.divTableCell}>{`${
                      data.weight / 10
                    } kg`}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <h1 className={styles.title}>Other popular pokemon</h1>
        <div className={styles.pokemonContainer}>{pokemons}</div>
      </main>
    </div>
  );
};
export default Home;
