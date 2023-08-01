// import NowPlayingView from './components/NowPlayingView'
// import PlaylistBody from './components/PlaylistBody'
// import ColumnDescriptions from './components/ColumnDescriptions'
import TopLeftMenu from './components/TopLeftMenu'
import LeftSidebarLibrary from './components/LeftSidebarLibrary'
import LeftSidebarLibraryList from './components/LeftSideBarLibraryList'
import SongFooter from './components/SongFooter'
import PlaylistHeading from './components/PlaylistHeading'
import { useState, useEffect, useRef } from 'react' 
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';



async function getTokenFromBackend() {
  try {
    const response = await fetch('https://difficult-fly-sombrero.cyclic.app/api/token'); // Changed the endpoint to the backend route
    const data = await response.json();
    const accessToken = data.token;
    return accessToken;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function fetchPlaylistTracksFromBackend(playlistURL) {
  try {
    const encodedURL = encodeURIComponent(playlistURL);
    const response = await fetch(`https://difficult-fly-sombrero.cyclic.app/api/playlist-track-uri?playlistUrl=${encodedURL}`);
    const data = await response.json();
    const tracks = data.tracks;
    return tracks;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}



function App() {
  const [tracks, setTracks] = useState([]);
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTimer, setSongTimer] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const [currentProgressWidth, setCurrentProgressWidth] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [playlistURL, setPlaylistURL] = useState('https://open.spotify.com/playlist/37i9dQZF1DXbirtHQBuwCo'); 
  const [data, setData] = useState([]);
  const [tracksLoaded, setTracksLoaded] = useState(true);

  useEffect(() => {
    
    const fetchData = async () => {
      
      const accessToken = await getTokenFromBackend();
      const playlistTracks = await fetchPlaylistTracksFromBackend(playlistURL);
      setTracks(playlistTracks);
      
    };

    fetchData();
  }, [playlistURL]);
 

  return (
    <>
      <div id='react-body'>
        
        <div id='testCase'>
          <TopLeftMenu />
          <LeftSidebarLibrary />
          <LeftSidebarLibraryList 
              setPlaylistURL={setPlaylistURL}
              data={data}
              setData={setData}
              tracksLoaded={tracksLoaded}
              setTracksLoaded={setTracksLoaded}
          />
          <SongFooter 
              tracks={tracks} 
              currentSong={currentSong} 
              setCurrentSong={setCurrentSong}
              setIsPlaying={setIsPlaying} 
              isPlaying={isPlaying} 
              songTimer={songTimer} 
              setSongTimer={setSongTimer}
              setProgressWidth={setProgressWidth} 
              setCurrentSongTime={setCurrentSongTime} 
              currentProgressWidth={currentProgressWidth}
              progressWidth={progressWidth} 
              currentSongTime={currentSongTime} 
              setCurrentProgressWidth={setCurrentProgressWidth}
              isAudioLoaded={isAudioLoaded} 
              setIsAudioLoaded={setIsAudioLoaded} 
          />
        </div>
        <div id='playlist-body'>
          <PlaylistHeading 
              tracks={tracks} 
              audioRef={audioRef} 
              currentSong={currentSong} 
              setCurrentSong={setCurrentSong}
              setIsPlaying={setIsPlaying} 
              isPlaying={isPlaying} 
              songTimer={songTimer} 
              setSongTimer={setSongTimer}
              setProgressWidth={setProgressWidth} 
              setCurrentSongTime={setCurrentSongTime} 
              currentProgressWidth={currentProgressWidth}
              progressWidth={progressWidth} 
              currentSongTime={currentSongTime} 
              setCurrentProgressWidth={setCurrentProgressWidth}
              isAudioLoaded={isAudioLoaded} 
              setIsAudioLoaded={setIsAudioLoaded} 
              data={data}
              setData={setData}
              playlistURL={playlistURL}
              setPlaylistURL={setPlaylistURL}
              tracksLoaded={tracksLoaded}
              setTracksLoaded={setTracksLoaded}
          />
        </div>
        
      </div>
      
      
      
    </>
  )
}

export default App




