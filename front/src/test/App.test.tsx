import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import memes from '../fixtures/memes.json'
import { server } from '../mocks/server'
import { rest } from 'msw'

const errorMessage500 = 'Se ha producido un error'

describe('List of memes', () => {
  it('should show memes', async () => {
    render(<App />)

    for (let meme of memes) {
      const memeTextElement = await screen.findByText(meme.title)

      expect(
        await screen.findByRole('img', { name: meme.title }),
      ).toHaveAttribute('src', meme.image.url)

      expect(memeTextElement).toBeInTheDocument()
    }
  })

  it('should show an error text if the request fail', async () => {
    server.use(
      rest.get('http://localhost:3001/api/memes', (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )

    render(<App />)

    const errorElement = await screen.findByText(errorMessage500)
    expect(errorElement).toBeInTheDocument()
  })
})

describe('Search memes', () => {
  it('should have a search input and button', async () => {
    render(<App />)

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    expect(searchInputElement).toBeInTheDocument()
    expect(searchButtonElement).toBeInTheDocument()

    await screen.findByText('Movie Brazil GIF by MOODMAN')
  })

  it('should have search button enabled only with words with more than 2 characters', async () => {
    render(<App />)

    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })
    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })

    expect(searchButtonElement).toHaveAttribute('disabled')
    fireEvent.change(searchInputElement, { target: { value: 'ca' } })
    expect(searchButtonElement).toHaveAttribute('disabled')
    fireEvent.change(searchInputElement, { target: { value: 'cat' } })
    expect(searchButtonElement).not.toHaveAttribute('disabled')

    await screen.findByText('Movie Brazil GIF by MOODMAN')
  })

  it.only('should show the memes filtered by the user search from the API', async () => {
    render(<App />)

    jest.spyOn(window, 'fetch')

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    userEvent.type(searchInputElement, '#foo')
    userEvent.click(searchButtonElement)

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/memes/search?filter=${encodeURIComponent(
        '#foo',
      )}`,
    )
    expect(
      await screen.findByRole('img', {
        name: 'Movie Brazil GIF by MOODMAN',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('img', {
        name: 'Dance Dancing GIF by MOODMAN',
      }),
    ).not.toBeInTheDocument()
  })
})

describe('Search  memes', () => {
  it('should show memes from the search', async () => {
    render(<App />)

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    fireEvent.change(searchInputElement, {
      target: { value: '#foo' },
    })
    fireEvent.click(searchButtonElement)

    expect(
      await screen.findByRole('img', {
        name: 'Movie Brazil GIF by MOODMAN',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('img', {
        name: 'Dance Dancing GIF by MOODMAN',
      }),
    ).not.toBeInTheDocument()
  })
})
