import React, { useEffect, useState } from 'react'

interface Meme {
  title: string
  id: string
  url: string
}

async function getMemes(): Promise<Meme[]> {
  const response = await fetch('http://127.0.0.1/')
  const { memes } = await response.json()
  return memes
}

async function searchMemes(term: string): Promise<Meme[]> {
  const response = await fetch('http://127.0.0.1/?search=' + term)
  const { memes } = await response.json()
  return memes
}

const App: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([])
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    getMemes()
      .then(setMemes)
      .catch(() => {
        setError('Oops!')
      })
  }, [])

  const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target
    searchMemes(value).then(setMemes)
  }
  if (error) {
    return <div role="alert">{error}</div>
  }
  return (
    <>
      <input
        type="search"
        name="search"
        placeholder="Buscar meme..."
        onChange={handleSearch}
      />
      {memes?.map((meme) => (
        <img alt={meme.title} key={meme.id} src={meme.url} />
      ))}
    </>
  )
}

export default App
