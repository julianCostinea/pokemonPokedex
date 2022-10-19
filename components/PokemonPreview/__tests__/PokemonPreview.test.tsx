import { render, screen } from '@testing-library/react'
import PokemonPreview from "../PokemonPreview";

describe('Pokemon Item test', () => {
  it('Renders a new pokemon', () => {
    render(<PokemonPreview name='New Pokemon' pokemonType='Grass' />)

    const heading = screen.getByRole('heading', {
      name: /new pokemon/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
