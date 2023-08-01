import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function SongFooter({
  tracks, 
  currentSong, 
  setCurrentSong, 
  setIsPlaying, 
  isPlaying , 
  songTimer, 
  setSongTimer , 
  progressWidth, 
  setProgressWidth, 
  currentSongTime, 
  setCurrentSongTime, 
  currentProgressWidth, 
  setCurrentProgressWidth, 
  isAudioLoaded, 
  setIsAudioLoaded
}) {
    
    const [loading, setLoading] = useState(true);
    const [pausedTime, setPausedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [songDuration, setSongDuration] = useState(0);
    const [volumeLevel, setVolumeLevel] = useState(20);
    const [previousVolume, setPreviousVolume] = useState(20);
    const audioRef = useRef(new Audio());
    const [timerId, setTimerId] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [shuffledTracks, setShuffledTracks] = useState([]);
    const [currentShuffledIndex, setCurrentShuffledIndex] = useState(0);
    const [isRepeating, setIsRepeating] = useState(false);
    const [currentRepeatedIndex, setCurrentRepeatedIndex] = useState(0);
    const [isShufflingFirstTime, setIsShufflingFirstTime] = useState(false);
    const [previousButtonClick, setPreviousButtonClick] = useState(false);

    function checkIfLoaded() {
        setLoading(tracks ? false : true);
    }

      useEffect(() => {
        checkIfLoaded();
      }, [tracks]);
    
      useEffect(() => {
        if (isShuffling) {
          const shuffled = shuffleArray(tracks, currentSong);
          setShuffledTracks(shuffled);
          setCurrentShuffledIndex(0);
          setIsShufflingFirstTime(true); 
        }
      }, [isShuffling, tracks]);

    
    useEffect(() => {
        if (isPlaying) {
          audioRef.current.play();
          if (currentSongTime > 0) {
            audioRef.current.currentTime = currentSongTime;
          }
          setTimerId(
            setInterval(() => {
              updateTime();
            }, 1) 
          );
        } else {
          audioRef.current.pause();
          if (timerId !== null) {
            clearInterval(timerId);
            setTimerId(null);
          }
        }
      }, [isPlaying, currentSong, tracks, currentSongTime, isAudioLoaded]);
  
    
      useEffect(() => {
        if (tracks[currentSong] && tracks[currentSong].track && tracks[currentSong].track.preview_url) {
          setIsAudioLoaded(false);
          if (isPlaying) {
            audioRef.current.pause();
          }
          audioRef.current.src = tracks[currentSong].track.preview_url;
          audioRef.current.volume = volumeLevel / 100; 

          audioRef.current.onpause = () => {
            setPausedTime(audioRef.current.currentTime); 
            setIsPaused(true);
          };
      
          audioRef.current.onplay = () => {
            setIsPaused(false);
          };
      
          audioRef.current.onloadeddata = () => {
            setIsAudioLoaded(true);
            const { currentTime, duration } = audioRef.current;
            const progressPercent = (currentTime / duration) * 100;
            setProgressWidth(progressPercent);
            const currentTimeInSeconds = Math.floor(currentTime);
            const durationInSeconds = Math.floor(duration);
            const formattedCurrentTime = formatTime(currentTimeInSeconds);
            const formattedDuration = formatTime(durationInSeconds);
      
            setSongTimer(formattedCurrentTime);
            setSongDuration(formattedDuration);
            if (isPlaying) {
              audioRef.current.play();
            }
          };
        }
      }, [currentSong, isPlaying, tracks]);
      

      useEffect(() => {
        audioRef.current.volume = volumeLevel / 100;
      }, [volumeLevel]);

      useEffect(() => {
        if (isRepeating && audioRef.current.ended) {
          
          setCurrentRepeatedIndex((prevIndex) => prevIndex === tracks.length - 1 ? 0 : prevIndex + 1);
          setCurrentSongTime(0);
          setCurrentProgressWidth(0);
          setIsPlaying(true);
        } else if (!isRepeating && audioRef.current.ended) {
          
          setIsPlaying(false);
        }
      }, [isRepeating, audioRef.current.ended, tracks.length]);

    
      function handleShuffle() {
        setIsShuffling(!isShuffling);
      
        if (!isShuffling) {
          // Store the original track order
          setShuffledTracks(shuffleArray(tracks));
          setIsShufflingFirstTime(true);
        } else {
          // Restore the original track order and set the currentSong to the previous value
          setShuffledTracks([]);
          setIsShufflingFirstTime(false);
          setCurrentShuffledIndex(tracks.indexOf(currentSong));
        }
      }
      
      function shuffleArray(array) {
        const currentIndex = array.indexOf(currentSong);
        const shuffledArray = array.slice();
      
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
      
        
        if (isShufflingFirstTime) {
          const shuffledIndex = shuffledArray.indexOf(tracks[currentSong]);
        
          [shuffledArray[0], shuffledArray[shuffledIndex]] = [shuffledArray[shuffledIndex], shuffledArray[0]];
        }
      
        return shuffledArray;
      }
      
      function handlePrevious() {
        
        const timeThreshold = isShuffling && currentShuffledIndex == 0 ? 0 : 2;
       
        if (isPlaying && timeThreshold < audioRef.current.currentTime) {
          
          setSongTimer(0);
          setProgressWidth(0);
          setCurrentSongTime(0);
          setCurrentProgressWidth(0);
          setIsPlaying(false);
          setPreviousButtonClick(true);
          setTimeout(() => {
            setIsPlaying(true);
          }, 100);
          setTimeout(() => {
            setPreviousButtonClick(false);
          }, 1000);
      
        } else {
          setPreviousButtonClick(false);
          setIsPlaying(true);
          if (isShuffling) {
            if (currentShuffledIndex === 0) {
              setCurrentShuffledIndex(currentShuffledIndex);
            } else {
              const prevShuffledIndex = currentShuffledIndex - 1;
              setCurrentShuffledIndex(prevShuffledIndex);
              setCurrentSong(tracks.indexOf(shuffledTracks[prevShuffledIndex]));
      
              if (isPlaying) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            }
          } else {
            if(currentSong == 0){
              setCurrentSong(0);
            }else{
              setCurrentSong((prevIndex) =>
                prevIndex - 1 >= 0 ? prevIndex - 1 : tracks.length - 1
              );
            }
            if (isPlaying) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }
      
          setCurrentSongTime(0);
          setCurrentProgressWidth(0);
        }
      }

    
      function handleNext() {
        if (isShuffling) {
          const nextIndex =
            currentShuffledIndex + 1 < shuffledTracks.length
              ? currentShuffledIndex + 1
              : 0;
          setCurrentShuffledIndex(nextIndex);
          setCurrentSong(tracks.indexOf(shuffledTracks[nextIndex]));
        } else {
          if (currentSong + 1 === tracks.length && isRepeating) {
            setCurrentSong(0);
          } else {
            setCurrentSong((prevIndex) =>
              prevIndex + 1 < tracks.length ? prevIndex + 1 : prevIndex
            );
          }
        }
      
        setCurrentSongTime(0);
        setCurrentProgressWidth(0);
        setIsPlaying(true);
      }
    
      function handlePlayPause() {
        if (isPlaying) {
          audioRef.current.pause();
          setCurrentSongTime(audioRef.current.currentTime);
          setCurrentProgressWidth(progressWidth); 
        } else {
          if (isAudioLoaded) {
            audioRef.current.currentTime = currentSongTime;
            audioRef.current.play();
          } else {
            setIsPlaying(true);
          }
        }
        setIsPlaying(!isPlaying);
      }
      
      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(1, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
      }
      function updateTime() {
        const { currentTime, duration } = audioRef.current;
      
        if (!isNaN(currentTime) && !isNaN(duration)) {
          const currentTimeInSeconds = Math.floor(currentTime);
          const durationInSeconds = Math.floor(duration);
      
          const formattedCurrentTime = formatTime(currentTimeInSeconds);
          const formattedDuration = formatTime(durationInSeconds);
      
          setSongTimer(formattedCurrentTime);
          setSongDuration(formattedDuration);
      
          if (!isPlaying) {
            setCurrentSongTime(currentTime);
            setProgressWidth(currentProgressWidth);
          } else {
            setProgressWidth((currentTime / duration) * 100);
          }
        }
      }
    
      const currentTrack = tracks && tracks[currentSong] && tracks[currentSong].track;
      
      if (loading) {
        return <div>Loading...</div>;
      }
      
      if (!currentTrack) {
        return (
          <div className='song-footer noTracks'>
                <div className='controls'>
                  <div className='play-pause'>
                      <i
                          className='fa-solid fa-shuffle'
                      ></i>
                      <button>
                          <i className='fa-solid fa-backward-step'></i>
                      </button>
                      <i className='fa-solid fa-circle-pause' style={{color: 'gray'}}></i>
                      <button>
                          <i className='fa-solid fa-forward-step'></i>
                      </button>
                      <i className="fa-solid fa-repeat"></i>
                  </div>

                  <div className='song-timer'>
                      <h1>---</h1>
                      <div className='progress'>
                              <div className='progress-bar' style={{backgroundColor: 'gray'}}></div>
                          </div>
                      <h1>---</h1>
                  </div>
                </div>
            </div>
        )
      }

      
      function handleVolumeChange(e) {
        const volumeValue = e.target.value;
        setVolumeLevel(volumeValue);
        audioRef.current.volume = volumeValue / 100; 
      }

      function handleMuteUnmute() {
        if (volumeLevel === 0) {
         
          setVolumeLevel(previousVolume);
        } else {
       
          setPreviousVolume(volumeLevel);
          setVolumeLevel(0);
        }
      }
      function handleSliderChange(e) {
        const sliderValue = parseInt(e.target.value, 10);
        const newCurrentTime = (sliderValue * audioRef.current.duration) / 100;
        audioRef.current.currentTime = newCurrentTime;
        setCurrentSongTime(newCurrentTime);
        setProgressWidth(sliderValue);
    
        if (!isPlaying) {
          setIsPlaying(true);
        }
      }
      
      
      function handleRepeatChange(e) {
        setIsRepeating(e.target.checked);
      }
      const artistNames = currentTrack && currentTrack.track && currentTrack.artists
      ? currentTrack.artists.map((artist, index) => (
          <a
            href={artist.external_urls.spotify}
            key={index}
            target="_blank"
            rel="noreferrer"
          >
            {artist.name}
            {index < currentTrack.artists.length - 1 && ', '}
          </a>
        ))
      : null;
    
    return (
        <div className='song-footer'>
            <audio
            ref={audioRef}
            onTimeUpdate={updateTime}
            onEnded={handleNext}
            />


            <div className='current-song'>
                <img src={currentTrack.album.images[1].url} alt={currentTrack.name} />
                <div>
                <h1>
                  <a href={currentTrack.external_urls.spotify} target="_blank" rel="noreferrer" style={{ color: 'white' }}>
                    {currentTrack.name}
                  </a>
                </h1>
                <h1>{artistNames}</h1>
                </div>
                <a href=""><i className="fa-regular fa-heart"></i></a>
            </div>


            
            <div className='controls'>
                <div className='play-pause'>
                  
                    <Tippy content={isShuffling ? 'Disable Shuffle' : 'Shuffle'} arrow={false}>
                      <button onClick={handleShuffle}>
                        <i className={`fa-solid fa-shuffle ${isShuffling ? 'active' : ''}`}></i>
                      </button>
                    </Tippy>
                  
                    
                    <button onClick={handlePrevious}>
                      <Tippy content="Previous" arrow={false} >
                            <i className='fa-solid fa-backward-step'></i>
                      </Tippy>
                    </button>

                    <button onClick={handlePlayPause}>
                      <Tippy content={isPlaying ? 'Pause' : 'Play'} arrow={false}>
                        <i className={`fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'}`}></i>
                      </Tippy>
                    </button>
                      
                      
                    <button onClick={handleNext}>
                      <Tippy content='Next' arrow={false}>
                            <i className='fa-solid fa-forward-step'></i>
                      </Tippy>
                    </button>

                    
                      <Tippy content={isRepeating ? 'Disable repeat' : 'Enable repeat'} arrow={false}>
                        <label className='repeat-checkbox'>
                          <input
                            type='checkbox'
                            checked={isRepeating}
                            onChange={handleRepeatChange}
                          />
                          <div className='repeat-icon'>
                            <i className={`fa-solid fa-repeat ${isShuffling ? 'active' : ''}`}></i>
                          </div>
                        </label>
                        
                      </Tippy>
                    
                    
                </div>

                <div className='song-timer'>
                    <h1>{isPlaying ? songTimer : formatTime(currentSongTime)}</h1>
                    <div className='progress'>
                            <div
                              className="progress-bar"
                              style={{ width: `${isPlaying ? progressWidth : currentProgressWidth}%` }}
                            ></div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isPlaying ? progressWidth : currentProgressWidth}
                              onChange={handleSliderChange}
                              className="slider-input"
                              
                            />
                        </div>
                    <h1>{songDuration}</h1>
                </div>
            </div>


            <div className='volume'>
              <button>
                <Tippy content="Now Playing View" arrow={false}>
                  <i className="fa-solid fa-music"></i>
                </Tippy>
              </button>
                
                
                  <Tippy content="Queue" arrow={false}>
                    <button>
                     <i className="fa-solid fa-layer-group"></i>
                    </button>
                  </Tippy>
                  
                
                  <Tippy content='Connect to a Device' arrow={false}>
                    <button>
                      <i className="fa-solid fa-house-laptop"></i>
                    </button>
                  </Tippy>
                  
                <div className='volume-control'>
                  
                    <button onClick={handleMuteUnmute}>
                      <Tippy content={volumeLevel == 0 ? 'Unmute' : 'Mute'}>
                        {volumeLevel == 0 ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume-high"></i>}
                      </Tippy>
                    </button>
                    
                    <div className='volume-progress-bar-container'>
                        <div
                            className='volume-progress-bar'
                            style={{
                                width: `${volumeLevel}%`,
                            }}
                        ></div>
                    </div>
                    
                    <input
                        type='range'
                        min='0'
                        max='100'
                        value={volumeLevel}
                        onInput={handleVolumeChange} 
                    />
                </div>
           </div>






            
        </div>
    );
  }


SongFooter.propTypes = {
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
      }).isRequired,
    })
  ).isRequired,
};



