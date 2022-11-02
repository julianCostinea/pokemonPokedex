import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import axios, { AxiosError } from "axios";
import { ParsedUrlQuery } from "querystring";

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

async function axiosGetJsonData<T>(url: string) {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    const errors = error as Error | AxiosError;
    if (axios.isAxiosError(error)) {
      throw new Error(`Error in 'axiosGetJsonData(${url})': ${errors.message}`);
    }
    // if (errors instanceof AxiosError) {
    //   throw new Error(
    //     `Error in 'axiosGetJsonData(${url})': ${errors.message}. Status: ${errors.status}`
    //   );
    // }
    throw new Error(`Unexpected error': ${errors.message}`);
  }
}

interface contextParams extends ParsedUrlQuery {
  pokeId: string;
}

export const getStaticProps: GetStaticProps<Pokemon, contextParams> = async (context) => {
  // let pokeId!:string;
  let pokeId: string | undefined;
  if (context.params) {
    pokeId = context.params.pokeId;
  }

  console.log("server logging");
  console.log(pokeId);

  if (pokeId == undefined) {
    return {
      redirect: {
        destination: "/no-data",
        statusCode: 307,
      },
    };
  }
  try {
    const res = await axiosGetJsonData<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
    if (!res) {
      return {
        // redirect: {
        //   destination: "/no-data",
        //   statusCode: 307,
        // },
        notFound: true,
      };
    }
    return {
      props: res,
    };
  } catch (error) {
    const errors = error as Error | AxiosError;
    console.error(errors.message);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { pokeId: "1" } }, { params: { pokeId: "2" } }, { params: { pokeId: "3" } }],
    fallback: true,
  };
};

function PokemonArticle({ name, sprites }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!name || !sprites) {
    return (
      <main className={styles.main}>
        <div className={styles.pokedexImageContainer}>Loading...</div>
        <h1 className={styles.title}>{name}</h1>
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Typescript Nextjs </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.pokedexImageContainer}>
          <Image layout="fill" src={sprites.front_default} alt="Pokemon front image" />
        </div>
        <h1 className={styles.title}>{name}</h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export default PokemonArticle;