import React from 'react'
import { Meme } from '../../Meme'
import { getMemesData, getFilteredMemesData } from '../../services/getMemesData'
import { SearchBox } from './_components/SearchBox'
import { MemeList } from './_components/MemeList/MemeList'

export const Home: React.FC = () => {
  const [memesData, setMemesData] = React.useState<Meme[]>([])
  const [filter, setFilter] = React.useState<string>('')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    getMemesData()
      .then((data) => {
        setMemesData(data)
      })
      .catch((error) => {
        setError('Se ha producido un error al obtener los memes mas recientes')
      })
  }, [])

  const handleSearch = () => {
    setError(null)
    const trimmedFilter = filter.trim().replace(/\s+/g, ' ')

    if (trimmedFilter.length < 3) {
      setError(
        'La longitud del termino de busqueda debe ser mayor de 2 caracteres',
      )
    }

    getFilteredMemesData(trimmedFilter)
      .then((data) => {
        setMemesData(data)
      })
      .catch((error) => {
        setError(
          'Se ha producido un error al realizar la búsqueda de los memes',
        )
      })
  }
  return (
    <>
      <SearchBox
        filter={filter}
        onFilterChanged={setFilter}
        onSearch={() => handleSearch()}
      />
      {error ? <p>{error}</p> : <MemeList memes={memesData} />}
    </>
  )
}
