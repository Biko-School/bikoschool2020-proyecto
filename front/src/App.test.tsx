import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import Memes from './memes.json'
import { server } from './mocks/server'
import { rest } from 'msw'

describe('listado de memes', () => {
  test('muestra un listado de memes', async () => {
    render(<App />)

    for (let memeItem of Memes) {
      const meme = await screen.findByRole('img', {
        name: memeItem.title,
      })

      expect(meme).toHaveAttribute('src', memeItem.url)
    }
  })

  test('hace una llamada a la api', async () => {
    const fetch = jest.spyOn(window, 'fetch')
    render(<App />)

    expect(fetch).toBeCalledWith('/api/memes')
  })

  test('muestra mensaje de error si la api no devuelve lo esperado', async () => {
    server.use(
      rest.get('/api/memes', (req, res, ctx) => {
        return res(ctx.status(500))
      }),
    )
    render(<App />)

    expect(await screen.findByText('Error')).toBeInTheDocument()
  })
})
