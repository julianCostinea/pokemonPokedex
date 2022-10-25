import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest, PathParams, DefaultBodyType } from "msw";
import Home from "../pages/index";
import user from "@testing-library/user-event";
import { Pokemon } from "../pages/index";
import { fetchedPokemons } from "../components/PokemonList/PokemonList";

const server = setupServer(
  rest.get<DefaultBodyType, { pokemon: string }, Pokemon>(
    "https://pokeapi.co/api/v2/pokemon/:pokemon",
    (req, res, ctx) => {

      return res(
        ctx.delay(100),
        ctx.json({
          id: 1,
          name: req.params.pokemon,
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
  rest.get<DefaultBodyType, PathParams, fetchedPokemons>("https://pokeapi.co/api/v2/pokemon", (req, res, ctx) => {
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
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Home", () => {
  it("renders a heading", async () => {
    render(<Home />);
    const heading = await screen.findByRole("heading", {
      name: /other popular pokemon/i,
    });

    expect(heading).toBeInTheDocument();
  });

  //test pokemon tpye on user input
  it("renders bulbasaur Pokemon Preview as grass type on Input", async () => {
    render(<Home />);
    await user.type(screen.getByLabelText("Pokemon:"), "bulbasaur");
    await user.click(screen.getByRole("button", { name: "Search pokemon" }));
    expect(await screen.findByText(/grass/i)).toBeInTheDocument();
  });
  //test pokemon name is always what user inputs
  it("renders whichever pokemon Name Pokemon Preview on Input", async () => {
    render(<Home />);
    await user.type(screen.getByLabelText("Pokemon:"), "charizard");
    await user.click(screen.getByRole("button", { name: "Search pokemon" }));
    expect(await screen.findByText(/charizard/i)).toBeInTheDocument();
  });

  //test with mocked PokemonList
});

//test with mocked PokemonPreview
