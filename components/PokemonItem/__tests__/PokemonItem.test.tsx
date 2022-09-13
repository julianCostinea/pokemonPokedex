import { render, screen } from '@testing-library/react'
import PokemonItem from "../PokemonItem";

describe('Article test', () => {
  it('Article renders heading text', () => {
    render(<PokemonItem name='New Pokemon' url = "url" />)

    const heading = screen.getByRole('heading', {
      name: /new pokemon/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
