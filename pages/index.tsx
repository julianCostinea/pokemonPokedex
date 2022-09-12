import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

import styles from "@/pages/index.module.css";
import type { NextPage } from "next";
import Article from "@/components/Article/Article";

const Home: NextPage = () => {
  const [errorHeader, setErrorHeader] = useState<string>("");
  const [items, setItems] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    fetch(
      "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=3uIDS53U17KFaoLdSGFCYP0QvGfppnpe"
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.results) {
          setErrorHeader(
            `Something went wrong. We're looking into it. No result.`
          );
          return;
        }
        // if (data.result.length == 0) {
        //   setErrorHeader(`Could not find any article to match your query.`);
        //   setItems(data.result);
        //   setFinishedSearch(true);
        //   return;
        // }
        setItems(data.results);
      })
      .catch((error) => {
        setErrorHeader(
          `Something went wrong. We're looking into it. Catch block`
        );
      });
  }, []);

  const articles = items.map((article) => {
      return <Article id={article.id} title={article.title} />;
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Popular New York Times Articles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Popular today</h1>
        <ul>{articles}</ul>
      </main>
    </div>
  );
};
export default Home;
