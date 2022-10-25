import { render, screen } from '@testing-library/react'
import PokemonPreview from "../PokemonPreview";

describe('Pokemon Item test', () => {
  it('Renders a new pokemon', () => {
    render(<PokemonPreview name='New Pokemon' pokemonType='Grass' sprite='/randomURL.jpg' id={0} height={0} weight={0} />)

    const heading = screen.getByRole('heading', {
      name: /new pokemon/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
