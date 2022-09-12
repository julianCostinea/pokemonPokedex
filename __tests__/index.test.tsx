import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ title: "Article title" }),
  }),
) as jest.Mock;

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /popular today/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
