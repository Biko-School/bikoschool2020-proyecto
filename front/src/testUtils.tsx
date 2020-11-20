import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

interface renderOptions {
  route?: string
}
export const renderWithProviders = (
  ui: React.ReactNode,
  { route = '/' }: renderOptions = {},
) => {
  const history = createMemoryHistory()
  history.push(route)
  render(<Router history={history}>{ui}</Router>)
}
