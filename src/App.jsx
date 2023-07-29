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



const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const tokenEndpoint = 'https://accounts.spotify.com/api/token';

const data = new URLSearchParams();
data.append('grant_type', 'client_credentials');
data.append('client_id', clientId);
data.append('client_secret', clientSecret);



async function getToken() {
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    const dataTwo = await response.json();
    const accessToken = dataTwo.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getPlaylistTrackUri(playlistUrl, accessToken) {
    try {
      const playlistId = playlistUrl.match(/playlist\/(\w+)/)[1];
      const limit = 100;
      let offset = 0;
      const allTracks = [];
  
      while (true) {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to retrieve playlist tracks');
        }
        const data = await response.json();
  
       
        const tracksWithPreviewUrl = data.items.filter((track) => track.track.preview_url !== null);
        allTracks.push(...tracksWithPreviewUrl);
  
        if (data.next) {
          offset += limit;
        } else {
          break;
        }
      }
      return allTracks;
    } catch (error) {
      console.error('Error:', error);
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

  useEffect(() => {
    const playlistUrl = 'https://open.spotify.com/playlist/4aHEvG0cTO93AMxxYmuuis'; 
  
    const fetchData = async () => {
      const accessToken = await getToken();
      const tracks = await getPlaylistTrackUri(playlistUrl, accessToken);
      setTracks(tracks);
    };
  
    fetchData();
  }, []);
 

  return (
    <>
      <div id='react-body'>
        
        <div id='testCase'>
          <TopLeftMenu />
          <LeftSidebarLibrary />
          <LeftSidebarLibraryList />
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
          />
        </div>
        
      </div>
      
      
      
    </>
  )
}

export default App




