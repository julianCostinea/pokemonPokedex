import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest, DefaultRequestMultipartBody, PathParams, DefaultBodyType } from "msw";
import { fetchedPokemons } from "../PokemonList";
import PokemonList from "../PokemonList";

const server = setupServer(
  rest.get<DefaultRequestMultipartBody, PathParams, fetchedPokemons>(
    "https://pokeapi.co/api/v2/pokemon",
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.json({
          results: [
            {
              name: "bulbasaur",
              url: "randomURL",
            },
          ],
        })
      );
    }
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("after application fully loads", () => {
  beforeEach(async () => {
    render(<PokemonList />);
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
  });
  
  it("renders pokemon name", () => {
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
  });
});

describe("when server returns error", () => {
  beforeEach(async () => {
    server.use(
      rest.get<DefaultBodyType, PathParams, { message: string }>(
        "https://pokeapi.co/api/v2/pokemon",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: "Sorry Something happened!" }));
        }
      )
    );
    render(<PokemonList />);
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
  });

  it("renders the error keeping the old data", () => {
    expect(screen.getByText("Sorry Something happened!")).toBeInTheDocument();
  });
});
