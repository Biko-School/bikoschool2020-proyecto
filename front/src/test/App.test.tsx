import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import memes from '../fixtures/memes.json'
import { server } from '../mocks/server'
import { rest } from 'msw'

describe('List of memes', () => {
  it('should show memes from the API', async () => {
    render(<App />)

    for (let meme of memes) {
      const imageElement = await screen.findByRole('img', { name: meme.title })
      expect(imageElement).toBeInTheDocument()
      expect(imageElement).toHaveAttribute('src', meme.image.url)
    }
  })

  it('should show an error text if the request fail', async () => {
    server.use(
      rest.get('http://localhost:3001/api/memes', (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )

    render(<App />)

    const errorElement = await screen.findByText(
      'Se ha producido un error al obtener los memes mas recientes',
    )
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

    // Meter esto para  que no salte el error "Can't perform a React state update on an unmounted component"
    const imageElement = await screen.findByRole('img', {
      name: 'Movie Brazil GIF by MOODMAN',
    })
    expect(imageElement).toBeInTheDocument()
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

    const imageElement = await screen.findByRole('img', {
      name: 'Movie Brazil GIF by MOODMAN',
    })
    expect(imageElement).toBeInTheDocument()
  })

  it('should show an error text if the search filter do not have a minimum length of 3 characters, ignoring side spaces and interior spaces greater than 1', async () => {
    render(<App />)

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    userEvent.type(searchInputElement, ' #f ')
    userEvent.click(searchButtonElement)

    const errorElement = await screen.findByText(
      'La longitud del termino de busqueda debe ser mayor de 2 caracteres',
    )
    expect(errorElement).toBeInTheDocument()
  })

  it('should ignore in the input search side spaces and interior spaces greater than 1 ', async () => {
    render(<App />)

    jest.spyOn(window, 'fetch')

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    userEvent.type(searchInputElement, ' #fo  o ')
    userEvent.click(searchButtonElement)

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/memes/search?filter=${encodeURIComponent(
        '#fo o',
      )}`,
    )
  })

  it('should show the memes of the search from the API', async () => {
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

  it('should show an error text if the search request fail', async () => {
    server.use(
      rest.get('http://localhost:3001/api/memes/search', (req, res, ctx) => {
        return res(ctx.status(500))
      }),
    )

    render(<App />)

    const searchInputElement = screen.getByRole('textbox', {
      name: /qué quieres buscar/i,
    })
    const searchButtonElement = screen.getByRole('button', {
      name: /comenzar búsqueda/i,
    })

    userEvent.type(searchInputElement, '#foo')
    userEvent.click(searchButtonElement)

    const errorElement = await screen.findByText(
      'Se ha producido un error al realizar la búsqueda de los memes',
    )
    expect(errorElement).toBeInTheDocument()
  })
})

describe('Meme detail', () => {
  it('should redirect to the detail page when meme image clicked', async () => {
    render(<App />)

    const imageElement = await screen.findByRole('img', {
      name: 'Movie Brazil GIF by MOODMAN',
    })
    userEvent.click(imageElement)

    const testElement = await screen.findByText('Movie Brazil GIF by MOODMAN')
    expect(testElement).toBeInTheDocument()
  })
})
