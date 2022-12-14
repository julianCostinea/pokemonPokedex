import { render, screen } from '@testing-library/react'
import PokemonItem from "../PokemonItem";

describe('Pokemon Item test', () => {
  it('Renders a new pokemon', () => {
    render(<PokemonItem name='New Pokemon' url = "url" />)

    const heading = screen.getByRole('heading', {
      name: /new pokemon/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
