import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'
import { Header } from './views/_components/Header/Header';

const MEMES_URL = 'http://127.0.0.1/api/memes'
// const MEMES_URL = 'http://localhost:3333/api/memes'


function App() {

  const [memes, setMemes] = useState<any>([])
  const [query, setQuery] = useState<string>("")

  const getMemes = async () => {
    const response = await fetch(MEMES_URL);
    const json = await response.json();
    return json
  }

  const getMemesWithQuery = async (q:string) => {
    const response = await fetch(MEMES_URL + '?query=' + q);
    debugger
    const json = await response.json();
    return json
  }

  useEffect(() => {
    if(query.length > 2){
      getMemesWithQuery(query)
      .then(setMemes)
    }
  }, [query]); //te pide array siempre


  useEffect(() => {
    getMemes()
    .then(setMemes)
    .catch()
  }, []); //si no le pones nada al array, se ejecuta una vez se monta el componente


  return (
    <>
      <Header>
      <input value={query} onChange={e => setQuery(e.target.value)} aria-label="Qué quieres buscar"/>
      </Header>
      {
        memes.map((element: any, idx: number) => {
          return <img key={element.id} src={element.images.original.url} alt={element.title + '-' + idx} />
        })
      }
    </>
  );
}

export default App;
