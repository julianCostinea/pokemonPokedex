import { render, screen } from "@testing-library/react";
import PokemonList from "../components/PokemonList/PokemonList";
import PokemonItem from "../components/PokemonItem/PokemonItem";
import Home from "../pages/index";
import user from "@testing-library/user-event";

jest.mock("../components/PokemonList/PokemonList");
const mockedPokemonList = jest.mocked(PokemonList);
mockedPokemonList.mockImplementation(() => (
  <>
    <PokemonItem url={"url1"} name={"bulbasaur"} key={"url1"} />
    <PokemonItem url={"url2"} name={"charmander"} key={"url2"} />
  </>
));

describe("Testing Pokemon List with Mocked Component", () => {
  beforeEach(() => {
    mockedPokemonList.mockClear();
  });

  it("renders charmander as part of mocked Pokemon List", async () => {
    render(<Home />);
    expect(await screen.findByText(/charmander/i)).toBeInTheDocument();
    expect(mockedPokemonList).toHaveBeenCalledTimes(1);
  });
});
