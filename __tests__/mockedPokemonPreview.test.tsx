import { render, screen } from "@testing-library/react";
import PokemonPreview from "../components/PokemonPreview/PokemonPreview";
import Home from "../pages/index";
import user from "@testing-library/user-event";

jest.mock("../components/PokemonPreview/PokemonPreview");
const mockedPokemonPreview = jest.mocked(PokemonPreview);
mockedPokemonPreview.mockImplementation(() => <div>Type: Grass</div>);

describe("Testing Pokemon Preview with Mocked Component", () => {
  beforeEach(() => {
    mockedPokemonPreview.mockClear();
  });

  it("renders bulbasaur Pokemon Preview as grass type on Input", async () => {
    render(<Home />);
    await user.type(screen.getByLabelText("Pokemon:"), "bulbasaur");
    await user.click(screen.getByRole("button", { name: "Search pokemon" }));
    expect(await screen.findByText(/grass/i)).toBeInTheDocument();
  });
});
