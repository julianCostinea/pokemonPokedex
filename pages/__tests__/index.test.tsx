import { render, screen, act } from "@testing-library/react";
import Home from "@/pages/index";
import axios, { AxiosResponse } from "axios";
import { fetchedPokemons } from "../index";

describe("Home", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a heading", async () => {
    render(<Home />);

    const heading = await screen.findByRole("heading", {
      name: /other popular pokemon/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders one pokemon after fetch", async () => {
    const mAxiosResponse = {
      data: { results: [{ url: "url", name: "pokemon" }] },
    } as AxiosResponse<fetchedPokemons>;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    await act(async () => {
      render(<Home />);
    });

    const pokemon = screen.getByTestId("pokemon");

    expect(pokemon).toBeInTheDocument();
  });
});
