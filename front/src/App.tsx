import React from 'react'
import { Meme } from './Meme'
import { getMemesData, getFilteredMemesData } from './services/getMemesData'
import { GlobalStyles } from './ui/theme/GlobalStyles/GlobalStyles'
import { Container } from './views/_components/Container'
import {
  Header,
  LogoWrapper,
  HeaderLogo,
  AppName,
} from './views/_components/Header'
import { SearchBox } from './views/_components/SearchBox'
import { MemeList } from './views/_components/MemeList/MemeList'

const App: React.FC = () => {
  const [memesData, setMemesData] = React.useState<Meme[]>([])
  const [filter, setFilter] = React.useState<string>('')
  const [error, setError] = React.useState<string>()

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
    const trimmedFilter = filter.trim().replace(/\s+/g, ' ')
    setFilter(trimmedFilter)

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

  //TODO manejar errores correctamente
  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header>
          <LogoWrapper>
            <HeaderLogo />
            <AppName>Guifaffinity</AppName>
          </LogoWrapper>
        </Header>

        <SearchBox
          filter={filter}
          onFilterChanged={setFilter}
          onSearch={() => handleSearch()}
        />

        <MemeList memes={memesData} />
      </Container>
    </>
  )
}

export default App
