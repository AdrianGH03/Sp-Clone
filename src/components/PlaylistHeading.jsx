import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';


function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}





export default function PlaylistHeading({ 
  tracks, 
  audioRef, 
  currentSong, 
  setCurrentSong, 
  setIsPlaying, 
  isPlaying, 
  songTimer, 
  setSongTimer, 
  setProgressWidth, 
  setCurrentSongTime, 
  setCurrentProgressWidth, 
  progressWidth, 
  currentSongTime, 
  isAudioLoaded, 
  setIsAudioLoaded 
}){
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState(-1);
  const simpleBarRef = useRef(null);
  

  useEffect(() => {
    // Function to handle the initial scroll position
    const handleInitialScrollPosition = () => {
      if (simpleBarRef.current) {
        setScrollPosition(simpleBarRef.current.getScrollElement().scrollTop);
      }
    };
  
    handleInitialScrollPosition(); // Call it once on mount to set the initial scroll position
  
    const playlistDiv = document.getElementById('PLAYLIST-DIV');
  
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollTop = playlistDiv.scrollTop;
        setScrollPosition(scrollTop);
      });
    };
  
    playlistDiv.addEventListener('scroll', handleScroll);
  
    // Clean up the scroll event listener when the component unmounts
    return () => {
      playlistDiv.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Scroll event handler for the SimpleBar component
    const handleSimpleBarScroll = () => {
      if (simpleBarRef.current) {
        setScrollPosition(simpleBarRef.current.getScrollElement().scrollTop);
      }
    };

    // Attach the scroll event listener to the SimpleBar component
    if (simpleBarRef.current) {
      simpleBarRef.current.getScrollElement().addEventListener('scroll', handleSimpleBarScroll);
    }

    // Clean up the scroll event listener when the component unmounts
    return () => {
      if (simpleBarRef.current) {
        simpleBarRef.current.getScrollElement().removeEventListener('scroll', handleSimpleBarScroll);
      }
    };
  }, []);



  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleString('en-US', options);
  }
  function msToMinutesAndSeconds(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = minutes.toString().padStart(1, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function timeToSeconds(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  function handlePlayPause(index) {
    if (isPlaying && currentSong === index) {
     
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSongTime(timeToSeconds(songTimer)); 
      setCurrentProgressWidth(progressWidth); 
    } else {
      if (isAudioLoaded) {
        if (currentSong !== index) {
          
          setCurrentSongTime(0);
          setCurrentProgressWidth(0);
          audioRef.current.currentTime = 0; 
        }
        setCurrentSong(index);
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        
        setIsPlaying(true);
        setCurrentSong(index);
      }
    }
  }
  
  

  
  const gridRows = tracks.map((track, index) => {
    const albumName = track.track.album.name;
    const songName = track.track.name;
    const truncatedAlbumName = albumName.length > 30 ? albumName.substring(0, 30) + '...' : albumName;
    const truncatedSongName = songName.length > 30 ? songName.substring(0, 30) + '...' : songName;

    const isCurrentTrackPlaying = isPlaying && currentSong === index;
    const artistNames = track.track.artists.map((artist, index) => 
      <a 
       href={artist.external_urls.spotify}
       key={index}
       target="_blank"
       rel="noreferrer"
      >
        {artist.name}{index < track.track.artists.length - 1 && ', '}
      </a>
    );

    
    return (
      <div
        key={index}
        className="grid-row"
        onMouseEnter={() => setHoveredTrackIndex(index)}
        onMouseLeave={() => setHoveredTrackIndex(-1)}
        
      >
      <div className='playlist-track grid-cell'>
        <div className='icon-container' >
          {hoveredTrackIndex === index ? (
            isCurrentTrackPlaying ? (
            
              <Tippy content='Pause' arrow={false}>
                <i className='fa-solid fa-pause-circle hover-circle' onClick={() => handlePlayPause(index)}></i>
              </Tippy>
              
            ) : (
              
              <Tippy content={`Play ${track.track.name} by ${track.track.album.artists[0].name}`} arrow={false}>
                <i className='fa-solid fa-circle-play hover-circle' onClick={() => handlePlayPause(index)}></i>
              </Tippy>
              
            )
          ) : (
            isCurrentTrackPlaying ? (
              <div id="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            ) : (
              <span
              style={
                currentSong === index ? { color: '#1ed760' } : { color: 'white' }
              } 
              >{index + 1}</span>
            )
          )}
          </div>
          <img
            src={track.track.album.images[0].url}
            alt=''
            style={hoveredTrackIndex === index ? { marginLeft: '1rem' } : { marginLeft: '1rem' }}
          />
          <div className='playlist-track-name'>
            <h6>
              <a
                href={track.track.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
                style={currentSong === index ? { color: '#1ed760' } : { color: 'white' }}
                data-tooltip={track.track.name} 
              >
                {truncatedSongName}
              </a>
            </h6>
            <span>{artistNames}</span>
          </div>
        </div>
      
        <div className="grid-cell side">{truncatedAlbumName}</div>
        <div className="grid-cell side">{formatDate(track.added_at)}</div>
        <div className="grid-cell side">{msToMinutesAndSeconds(track.track.duration_ms)}</div>
      </div>
    );
  });
    

    
    const totalSeconds = tracks.length * 29;

    // Convert to minutes and hours
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    
    function handleTopPlayPause() {
      if (currentSong == -1) {
        
        setCurrentSong(0);
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentSongTime(timeToSeconds(songTimer)); 
          setCurrentProgressWidth(progressWidth); 
        } else {
         
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    }
    

    
    return(
        <>
        <SimpleBar ref={simpleBarRef} forceVisible="y" autoHide={true} style={{ maxHeight: '58rem' }}>
        <div id='PLAYLIST-DIV'>
          <div className="playlist-content-wrapper">
          <nav className='playlist-nav'
          style={{ 
            backgroundColor: scrollPosition > 330 ? 'rgb(4, 30, 44)' : 'transparent',
          }}
          >
                    <div className='playlist-nav-page'>
                        <button><i className="fa-solid fa-chevron-left"></i></button>
                        <button><i className="fa-solid fa-chevron-right"></i></button>
                        <div className={`fade-in ${scrollPosition > 330 ? 'visible' : ''}`}>
                          {isPlaying ? (
                            <i className="fa-solid fa-pause-circle" onClick={handleTopPlayPause}></i>
                          ) : (
                            <i className="fa-solid fa-circle-play" onClick={handleTopPlayPause}></i>
                          )}
                        </div>
                    </div>
                    
                    <div className='playlist-user'>
                        <button id='premium'>Explore Premium</button>
                        <button id='installApp'><i className="fa-regular fa-circle-down"></i>Install App</button>
                        
                        <button>
                          <Tippy content="Adriancito" arrow={false} placement="bottom-start">
                          <img src="spidermandl.jpeg" alt="" />
                          </Tippy>
                        </button>
                    </div>
                </nav>
            <div className='playlist-heading'>


                

                <div className='playlist-title'>
                     <img src="playlistimage.jpg" alt="" />
                     <div className='playlist-title-info'>
                         <span>Playlist</span>
                         <h1>2023 Playlist</h1>
                        <div className='playlist-title-moreinfo'>
                             <img src="spidermandl.jpeg" alt="" />
                             <a href="">Adriancito</a>
                             <i className="fa-solid fa-circle"></i>
                            <span>{tracks.length} songs, <span>about {hours > 0 && `${hours} hr `}{remainingMinutes} mins</span></span>
                        </div>
                    </div>
                </div>



                
            </div>
            
          <div className='playlist-songs' id="PLAYLIST-SONGS">
              <section>
                 <div className='playlist-play-edit'>
                    {isPlaying ? 
                    <i className="fa-solid fa-pause-circle" onClick={handleTopPlayPause} ></i>
                    : <i className="fa-solid fa-circle-play" onClick={handleTopPlayPause}></i>
                   }
                   <Tippy content='More options for 2023 Playlist' arrow={false}>
                      <button><i className="fa-solid fa-ellipsis"></i></button>
                   </Tippy>
                    
                  </div>
                  <div className="grid-headings"
                  style={{ 
                    backgroundColor: scrollPosition > 370 ? '#121212' : 'transparent',
                    paddingTop: scrollPosition > 370 ? '5rem' : '0.5rem',
                  }}
                  >
                    <div>#<div>Title</div></div>
                    <div>Album</div>
                    <div>Date added</div>
                    <div>
                      <Tippy content='Duration' arrow={false}>
                        <button style={{color: 'rgb(173, 173, 173)'}}><i className='fa-regular fa-clock'></i></button>
                      </Tippy>
                    </div>
                  </div>
                  <div className="grid-container">{gridRows}</div>
              </section>
            </div>
            
            </div>
          </div>
          </SimpleBar>
        </>
    )
}

PlaylistHeading.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      track: PropTypes.shape({
        album: PropTypes.shape({
          images: PropTypes.arrayOf(
            PropTypes.shape({
              url: PropTypes.string.isRequired,
            })
          ).isRequired,
        }).isRequired,
        name: PropTypes.string.isRequired,
        artists: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
          })
        ).isRequired,
        preview_url: PropTypes.string, 
      }).isRequired,
    })
  ).isRequired,
  audioRef: PropTypes.object.isRequired,
  currentSong: PropTypes.number.isRequired,
  setCurrentSong: PropTypes.func.isRequired,
};


//SongFooter.js (separate file)
