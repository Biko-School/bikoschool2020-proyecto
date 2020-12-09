import userEvent from '@testing-library/user-event'
import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'
import Cookies from 'js-cookie'
import loggedInUser from '../fixtures/loggedInUser.json'

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

describe('Login', () => {
  it('should show the user display name and log out button when logged', async () => {
    render(<App />)

    const userNameInputElement = screen.getByRole('textbox', {
      name: /Introduce el nombre de usuario/i,
    })
    const loginButtonElement = screen.getByRole('button', {
      name: /Loguearse/i,
    })

    userEvent.type(userNameInputElement, 'valid_username')
    userEvent.click(loginButtonElement)

    const userDisplayNameTextElement = await screen.findByText(
      'Fulanito de tal',
    )
    const logOutButtonElement = await screen.findByRole('button', {
      name: /Desloguearse/i,
    })

    expect(userDisplayNameTextElement).toBeInTheDocument()
    expect(logOutButtonElement).toBeInTheDocument()

    Cookies.remove('Guiffy-cookie')
  })

  it('should call the API', async () => {
    render(<App />)
    jest.spyOn(window, 'fetch')

    const userNameInputElement = screen.getByRole('textbox', {
      name: /Introduce el nombre de usuario/i,
    })
    const loginButtonElement = screen.getByRole('button', {
      name: /Loguearse/i,
    })

    userEvent.type(userNameInputElement, 'valid_username')
    userEvent.click(loginButtonElement)

    expect(window.fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/login/valid_username`,
    )

    await screen.findByRole('button', {
      name: /Desloguearse/i,
    })

    Cookies.remove('Guiffy-cookie')
  })

  it('should show a error message if the user is not registered', async () => {
    render(<App />)

    const userNameInputElement = screen.getByRole('textbox', {
      name: /Introduce el nombre de usuario/i,
    })
    const loginButtonElement = screen.getByRole('button', {
      name: /Loguearse/i,
    })

    userEvent.type(userNameInputElement, 'invalid_username')
    userEvent.click(loginButtonElement)

    const errorTextElement = await screen.findByText(
      'El usuario con el que intentas acceder no está registrado.',
    )
    expect(errorTextElement).toBeInTheDocument()
  })

  it('should show the login input text and login button when the user logout', async () => {
    Cookies.set('Guiffy-cookie', loggedInUser)

    render(<App />)

    const logoutButtonElement = screen.getByRole('button', {
      name: /Desloguearse/i,
    })

    userEvent.click(logoutButtonElement)

    const userNameInputElement = await screen.findByRole('textbox', {
      name: /Introduce el nombre de usuario/i,
    })
    const loginButtonElement = await screen.findByRole('button', {
      name: /Loguearse/i,
    })

    expect(userNameInputElement).toBeInTheDocument()
    expect(loginButtonElement).toBeInTheDocument()
    expect(Cookies.get('Guiffy-cookie')).toBeFalsy()
  })
})
