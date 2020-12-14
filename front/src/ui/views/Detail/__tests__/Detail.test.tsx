import React from 'react'
import { screen, render } from '@testing-library/react'
import { Detail } from '../Detail'
import { MemoryRouter, Route } from 'react-router-dom'
import memeDetailWithUser from '../../../../fixtures/memeDetailWithUser.json'
import memeDetailWithoutUser from '../../../../fixtures/memeDetailWithoutUser.json'
import relatedMemes from '../../../../fixtures/relatedMemes.json'

import { server } from '../../../../mocks/server'
import { rest } from 'msw'
import loggedInUser from '../../../../fixtures/loggedInUser.json'
import { AuthProvider } from '../../../../domain/AuthContext'

describe('Detail of a meme', () => {
  it('should show the detail of the meme without user', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/memes/YleuWir5NTNVXkflSp']}>
          <Route path="/memes/:id">
            <Detail />
          </Route>
        </MemoryRouter>
      </AuthProvider>,
    )

    const memeTitleElement = await screen.findByText(
      memeDetailWithoutUser.title,
    )
    const memeImageElement = await screen.findByRole('img', {
      name: memeDetailWithoutUser.title,
    })

    expect(memeTitleElement).toBeInTheDocument()
    expect(memeImageElement).toBeInTheDocument()
    expect(memeImageElement).toHaveAttribute(
      'src',
      memeDetailWithoutUser.image.url,
    )
    for (let tag of memeDetailWithoutUser.tags) {
      const tagTextElement = await screen.findByText(tag)
      expect(tagTextElement).toBeInTheDocument()
    }
  })

  it('should show the detail of the meme with user', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/memes/XEbIyyo02CsFyDmFXL']}>
          <Route path="/memes/:id">
            <Detail />
          </Route>
        </MemoryRouter>
      </AuthProvider>,
    )

    const memeTitleElement = await screen.findByText(memeDetailWithUser.title)
    const memeImageElement = await screen.findByRole('img', {
      name: memeDetailWithUser.title,
    })
    const userNameElement = await screen.findByText(
      memeDetailWithUser.user.name,
    )
    const userAvatarImageElement = await screen.findByRole('img', {
      name: memeDetailWithUser.user.name,
    })

    expect(memeTitleElement).toBeInTheDocument()
    expect(memeImageElement).toBeInTheDocument()
    expect(memeImageElement).toHaveAttribute(
      'src',
      memeDetailWithUser.image.url,
    )
    for (let tag of memeDetailWithUser.tags) {
      const tagTextElement = await screen.findByText(tag)
      expect(tagTextElement).toBeInTheDocument()
    }

    expect(userNameElement).toBeInTheDocument()
    expect(userAvatarImageElement).toBeInTheDocument()
    expect(userAvatarImageElement).toHaveAttribute(
      'src',
      memeDetailWithUser.user.avatar_url,
    )
  })

  it('should show an error test if the meme id not exist', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/memes/notExistingId']}>
          <Route path="/memes/:id">
            <Detail />
          </Route>
        </MemoryRouter>
      </AuthProvider>,
    )
    const errorElement = await screen.findByText(
      'Se ha producido un error al obtener el detalle del meme',
    )
    expect(errorElement).toBeInTheDocument()
  })

  it('should show an error test if the request fail', async () => {
    server.use(
      rest.get('http://localhost:3001/api/memes/:id', (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/memes/irrelevantId']}>
          <Route path="/memes/:id">
            <Detail />
          </Route>
        </MemoryRouter>
      </AuthProvider>,
    )

    const errorElement = await screen.findByText(
      'Se ha producido un error al obtener el detalle del meme',
    )
    expect(errorElement).toBeInTheDocument()
  })
})

describe('Related memes', () => {
  it('should show the related memes', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/memes/XEbIyyo02CsFyDmFXL']}>
          <Route path="/memes/:id">
            <Detail />
          </Route>
        </MemoryRouter>
      </AuthProvider>,
    )

    for (let relatedMeme of relatedMemes) {
      const relatedMemeImageElement = await screen.findByRole('img', {
        name: relatedMeme.title,
      })

      expect(relatedMemeImageElement).toBeInTheDocument()
      expect(relatedMemeImageElement).toHaveAttribute(
        'src',
        relatedMeme.image_url,
      )
    }
  })

  describe('Comments', () => {
    it('should show comments textarea if the user is logged', async () => {
      localStorage.setItem('user', JSON.stringify(loggedInUser))

      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/memes/XEbIyyo02CsFyDmFXL']}>
            <Route path="/memes/:id">
              <Detail />
            </Route>
          </MemoryRouter>
        </AuthProvider>,
      )

      const commentTextAreaElement = await screen.findByRole('textbox', {
        name: /¿Algo que comentar?/i,
      })
      expect(commentTextAreaElement).toBeInTheDocument()
    })

    it('should not show comments textarea if the user is not logged', async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/memes/XEbIyyo02CsFyDmFXL']}>
            <Route path="/memes/:id">
              <Detail />
            </Route>
          </MemoryRouter>
        </AuthProvider>,
      )

      const commentTextAreaElement = screen.queryByRole('textbox', {
        name: /¿Algo que comentar?/i,
      })
      expect(commentTextAreaElement).not.toBeInTheDocument()
    })
  })
})
