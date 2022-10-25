/* eslint-disable testing-library/no-render-in-setup */
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import React from "react";
import PokemonPreviewWithSwr from "./PokemonPreviewWithSwr";
import { MySwrConfig } from "../MySwrConfig";
import { setupServer } from 'msw/node';
import { DefaultBodyType, PathParams, rest } from 'msw';
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

      return res(
        ctx.delay(100),
        ctx.status(500),
        ctx.json({ message: 'Unit test message' })
      );
    }
  ),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("PokemonPreview tests with swr", () => {
  describe('when passing bulbasaur', () => {
    beforeEach(async () => {
      render(
        <MySwrConfig>
          <PokemonPreviewWithSwr pokemonQuery="bulbasaur" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
    });

    it('renders bulbasaur', () => {
      const element = screen.getByText("bulbasaur");
      expect(element).toBeInTheDocument();
    });
  });
});
