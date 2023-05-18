import './App.css'
import { useEffect, useState } from 'react'

const fetchEpisodes = async () => {
  const url = 'https://rickandmortyapi.com/api/episode'
  const res = await fetch(url);
  return res.json();
}

const fetcCharacter = async (url) => {
  const res = await fetch(url);
  return res.json();
}

const fetchAllCharacters = async (urlCharacters) => {
  const urlCharacterSet = new Set();
  urlCharacters.forEach((url) => {
    urlCharacterSet.add(url);
  });

  const promisesCharacters = Array.from(urlCharacterSet).map((urlCharacter) => {
    const promiseCharacter = fetcCharacter(urlCharacter);
    return promiseCharacter;
  })
  const dataCharacters = await Promise.all(promisesCharacters);
  return dataCharacters;
}

const createNewData = (episodes, characters) => {
  const newData = episodes.map((episode) => {
    return {
      title: `${episode.name} - ${episode.episode}`,
      dateOnAir: episode.air_date,
      characters: episode.characters.slice(0, 10).map((url) => {
        return characters.find((item) => url === item.url)
      })
    }
  })

  return newData;
}

function App() {

  const [allData, setAllData] = useState();


  useEffect(() => {
    const fetchInit = async () => {
      const episodesData = await fetchEpisodes();
      const episodesList = episodesData.results

      let listCharacters = [];
      episodesList.map((episode) => {

        episode.characters.map((urlCharacter, index) => {
          if (index <= 9) {
            listCharacters.push(urlCharacter);
          }
        })
      })

      const charactersData = await fetchAllCharacters(listCharacters);

      const data = createNewData(episodesList, charactersData);
      console.log(data);
      setAllData(data);
    }

    fetchInit();

  }, [])



  return (
    <>
      <h1>PETICIONES RICK AND MORTY</h1>
      <br />
      <h2>LISTADO DE CAPITULOS</h2>
      <br />
      {allData.map((episode, index) => {
        return (
          <div key={index} className='c-episode'>
            <p><strong>{episode.title}</strong></p>            
            <p>Fecha al aire: {episode.dateOnAir}</p>            
            <p>Personajes:</p>
            <div className='c-characters'>
              <ul>
                {episode.characters.map((character, index) => {
                  return <li key={index}>{`${character.name} - ${character.species}`}</li>
                })}
              </ul>
            </div>
          </div>
        )
      })}
      <br />
    </>
  )
}

export default App
