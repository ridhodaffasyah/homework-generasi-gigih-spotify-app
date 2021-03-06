import React, { useState, useEffect } from 'react'

import { Input, IconButton } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Track from '../track/track'
import axios from 'axios'
import Playlist from '../playlist/playlist'
import Button from '../button/button'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface TrackData {
  uri: string;
  name: string;
  durationms: number;
  artists: {
    name: string;
  }[];
  album: {
    name: string;
    images: {
      url: string;
    }[];
  };
}

const Search = () => {
  const [track, setTrack] = useState<TrackData[]>([])
  const [query, setQuery] = useState<string>('')
  const [selectedTrack, setSelectedTrack] = useState<string[]>([])
  const [userId, setUserId] = useState<string>('')
  const [titleForm, setTitleForm] = useState<string>('')
  const [descForm, setDescForm] = useState<string>('')

  const getUserToken = (state : RootState) => state.user.userToken
  const userToken = useSelector(getUserToken)

  // console.log(user_token);

  const fetchData = () => {
    if (!query) {
      return
    }
    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    }).then((response) => {
      setTrack(response.data.tracks.items)
    }).catch((error) => {
      console.log(error)
    })
  }

  const fetchUser = () => {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    })
      .then(res => {
        setUserId(res.data.id)
      })
      .catch(err => {
        console.log(err)
      })
  }

  console.log(userId)

  const handlePlaylistInitiate = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (titleForm.length < 10) { alert('Title must be at least 10 characters') }
    const play = axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, JSON.stringify({
      name: titleForm,
      description: descForm,
      public: false
    }), {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    })
      .then(res => {
        // setPlaylist(res.data);
        return res.data
      })
      .catch(err => {
        console.log(err)
      })

    return play
  }

  const addTrackToPlaylist = (playlistID: string) => {
    axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, JSON.stringify({
      uris: selectedTrack
    }), {
      headers: {
        Authorization: 'Bearer ' + userToken
      }
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const clearState = () => {
    setSelectedTrack([])
    setTitleForm('')
    setDescForm('')
  }

  const handlePlaylist = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const playlistId = await handlePlaylistInitiate(e)
    addTrackToPlaylist(playlistId.id)
    alert('Playlist created')
    clearState()
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setQuery(e.target.value)
  }

  const addToList = (id: string) => {
    let selectedSong : string[] = []
    selectedSong = selectedTrack
    selectedSong.push(id)
    setSelectedTrack(selectedSong)
  }

  const removeFromList = (id: string) => {
    const selectedSong = selectedTrack
    for (let i = 0; i < selectedTrack.length; i++) {
      if (selectedTrack[i] === id) {
        selectedSong.splice(i, 1)
      }
    }
    setSelectedTrack(selectedSong)
  }

  const getStatus = (id: string) => {
    let status = false
    for (let i = 0; i < selectedTrack.length; i++) {
      if (selectedTrack[i] === id) {
        status = true
      }
    }
    return status
  }

  const handleTitleChange = (e: { target: { value: string} }) => {
    const { value } = e.target
    setTitleForm(value)
  }

  const handleDescChange = (e: { target: { value: string } }) => {
    const { value } = e.target
    setDescForm(value)
  }

  useEffect(() => {
    if (userToken) {
      fetchUser()
    }
  }, [])

  console.log(track)

  return (
        <div className='center-content'>
            <h1 className='title'>Track List<span>.</span></h1>
            <div className='input'>
              <Input placeholder='Cara track favoritmu..' size='md' className='search-input' onChange={e => handleInput(e)}/>
              <IconButton
                className='search-icon'
                icon={<SearchIcon className='search-button' />}
                onClick={fetchData} aria-label={''}/>
            </div>
            <Playlist handleTitleChange={handleTitleChange} handleDescChange={handleDescChange} handlePlaylist={handlePlaylist}></Playlist>
            <div className='grid'>
              {track.map((track) => {
                const status = getStatus(track.uri)
                return (
                      <Track
                          data-testid='tracks'
                          key={track.uri}
                          trackImg={track.album.images[0].url}
                          trackArtist={track.artists[0].name}
                          trackAlbum={track.album.name}
                          trackName={track.name}
                          trackDuration={Math.floor(track.durationms / 1000 / 60) + 'm ' + Math.floor(((track.durationms / 1000 / 60) % 1) * 10) + 's'}
                      >
                          <Button statusSelect={status} removeFromList={removeFromList} addToList={addToList} id={track.uri} />
                      </Track>)
              })}
            </div>
          </div>
  )
}

export default Search
