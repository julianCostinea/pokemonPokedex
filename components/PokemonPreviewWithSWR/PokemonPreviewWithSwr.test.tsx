/* eslint-disable testing-library/no-render-in-setup */
import { render, screen, waitForElementToBeRemoved, RenderOptions } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import PokemonPreviewWithSwr from "./PokemonPreviewWithSwr";
import { MySwrConfig } from "../MySwrConfig";
import { setupServer } from "msw/node";
import { DefaultBodyType, PathParams, rest } from "msw";
import { Pokemon } from "../../pages/fromuseswr";

const server = setupServer(
  rest.get<DefaultBodyType, { pokemon: string }, Pokemon>(
    "https://pokeapi.co/api/v2/pokemon/bulbasaur",
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json({
          id: 1,
          name: "bulbasaur",
          height: 1,
          weight: 1,
          sprites: {
            front_default: "/photo.jpg",
          },
          types: [
            {
              type: {
                name: "grass",
              },
            },
          ],
        })
      );
    }
  ),
  rest.get<DefaultBodyType, { pokemon: string }, Pokemon>(
    "https://pokeapi.co/api/v2/pokemon/charmander",
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json({
          id: 1,
          name: "charmander",
          height: 1,
          weight: 1,
          sprites: {
            front_default: "/photo.jpg",
          },
          types: [
            {
              type: {
                name: "fire",
              },
            },
          ],
        })
      );
    }
  ),
  rest.get<DefaultBodyType, { pokemon: string }, { message: string }>(
    "https://pokeapi.co/api/v2/pokemon/squirtle",
    (req, res, ctx) => {
      return res(ctx.delay(100), ctx.status(500), ctx.json({ message: "Unit test message" }));
    }
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("PokemonPreview tests with swr", () => {
  describe("when passing bulbasaur", () => {
    beforeEach(async () => {
      customRender(<PokemonPreviewWithSwr pokemonQuery="bulbasaur" />);
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it("renders bulbasaur", () => {
      const element = screen.getByText("bulbasaur");
      expect(element).toBeInTheDocument();
    });
  });

  describe("when passing charmander", () => {
    beforeEach(async () => {
      customRender(<PokemonPreviewWithSwr pokemonQuery="charmander" />);
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it("renders charmander", () => {
      const element = screen.getByText("charmander");
      expect(element).toBeInTheDocument();
    });
  });

  describe("when passing squirtle", () => {
    beforeEach(async () => {
      render(
        <MySwrConfig swrConfig={{ dedupingInterval: 0, provider: () => new Map() }}>
          <PokemonPreviewWithSwr pokemonQuery="squirtle" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it("show pokemon header", () => {
      expect(screen.getByText("Who's that pokemon?")).toBeInTheDocument();
    });

    it("show expected error message", () => {
      expect(screen.getByText("Unit test message")).toBeInTheDocument();
    });
  });

  describe("when no results returned", () => {
    beforeEach(async () => {
      server.use(
        rest.get<DefaultBodyType, PathParams, string[]>(
          "https://pokeapi.co/api/v2/pokemon/bulbasaur",
          (req, res, ctx) => {
            return res(ctx.delay(100), ctx.json([]));
          }
        )
      );

      customRender(<PokemonPreviewWithSwr pokemonQuery="bulbasaur" />);
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it("show expected no data message", () => {
      expect(screen.getByText("No Data to Show")).toBeInTheDocument();
    });
  });
});

const AllTheProviders: FC<{ children: ReactElement }> = ({ children }) => {
  return <MySwrConfig swrConfig={{ dedupingInterval: 0, provider: () => new Map() }}>{children}</MySwrConfig>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });
