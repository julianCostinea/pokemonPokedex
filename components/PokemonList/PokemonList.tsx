import React, { ReactElement, useEffect, useState } from "react";
import PokemonItem from "../PokemonItem/PokemonItem";
import axios from "axios";

import classes from "./PokemonList.module.css";

export interface fetchedPokemons {
  results: {
    url: string;
    name: string;
  }[];
}

interface responseError {
  response: {
    data: {
      message: string;
    };
  };
}
function instanceOfResponseError(object: any): object is responseError {
  return "response" in object;
}

async function axiosGetJsonData<T>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error: any) {
    if (instanceOfResponseError(error)) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`Error in 'axiosGetJsonData(${url})': ${error.message}`);
  }
}

const PokemonList: React.FC = ({}): ReactElement => {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading((l) => l + 1);
      try {
        const fetchResponse = await axiosGetJsonData<fetchedPokemons>("https://pokeapi.co/api/v2/pokemon?limit=151");
        setItems(fetchResponse.results);
      } catch (error: any) {
        setErrorHeader(error.message);
      } finally {
        setLoading((l) => l - 1);
      }
    };
    void fetchPokemon();
  }, []);

  const [items, setItems] = useState<fetchedPokemons["results"]>([]);
  const [errorHeader, setErrorHeader] = useState<string>("");

  const randomPokemonNumber = Math.floor(Math.random() * 152);
  let pokemons: JSX.Element[];
  if (items.length > 10) {
    pokemons = items.slice(randomPokemonNumber - 5, randomPokemonNumber + 15).map((pokemon) => {
      return <PokemonItem url={pokemon.url} name={pokemon.name} key={pokemon.url} />;
    });
  } else {
    pokemons = items.map((pokemon) => {
      return <PokemonItem url={pokemon.url} name={pokemon.name} key={pokemon.url} />;
    });
  }

  return (
    <>
      {loading ? <div>Loading...</div> : null}
      <h2 style={{ color: "red" }}>{errorHeader}</h2>
      <div className={classes.pokemonContainer}>{pokemons}</div>
    </>
  );
};
export default PokemonList;
