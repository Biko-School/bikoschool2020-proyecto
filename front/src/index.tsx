import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AuthProvider } from './domain/AuthContext'
import * as serviceWorker from './serviceWorker'

if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_MOCK === 'true'
) {
  const { worker } = require('./mocks/browser')
  worker.start()
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
