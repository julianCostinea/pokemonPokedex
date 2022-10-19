import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { setupServer } from 'msw/node';
import { rest, DefaultRequestMultipartBody, PathParams, DefaultBodyType } from 'msw';
import { fetchedPokemons } from "../PokemonList";
import PokemonList from "../PokemonList";

const server = setupServer(
  rest.get<DefaultRequestMultipartBody, PathParams, fetchedPokemons>("https://pokeapi.co/api/v2/pokemon", (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.json(
          {
            results:[
              {
                name: "bulbasaur",
                url: "randomURL"
              }
            ]
          }
      )
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('after application fully loads', () => {
  beforeEach(async () => {
    render(<PokemonList />);
    await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
  });

  it('renders pokemon name', async() => {
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });
});
