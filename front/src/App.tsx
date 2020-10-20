import React from 'react'
import { getMemesData, MemesData } from './services/getMemesData'

const App: React.FC = () => {
  const [memesData, setMemesData] = React.useState<MemesData[]>([])
  const [error, setError] = React.useState<String>()

  React.useEffect(() => {
    getMemesData()
      .then((data) => {
        setMemesData(data)
      })
      .catch((error) => {
        setError('Se ha producido un error')
      })
  }, [])

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <ul>
        {memesData?.map((meme) => (
          <li key={meme.id}>
            <img src={meme.image.url} alt={meme.title} /> {meme.title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
