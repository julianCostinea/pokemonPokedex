import React, { ReactNode } from "react";
import { SWRConfig } from "swr";
import { Fetcher, PublicConfiguration } from "swr/dist/types";
import axios from "axios";
import { Pokemon } from "../pages/fromuseswr";

export function MySwrConfig({
  children,
  swrConfig,
}: {
  children?: ReactNode;
  // eslint-disable-next-line
  swrConfig?: Partial<PublicConfiguration<any, any, Fetcher<any>>>;
}) {
  return <SWRConfig value={{ fetcher: customFetcher, ...swrConfig }}>{children}</SWRConfig>;
}

export async function customFetcher(url: string) {
  const res = await axios.get<Pokemon>(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (res.status !== 200) {
    throw new Error(res.data.error.message);
  }

  return res.data;
}
