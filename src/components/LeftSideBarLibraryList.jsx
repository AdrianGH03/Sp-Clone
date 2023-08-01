// import React from 'react'
import { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import PropTypes from 'prop-types';

export default function LeftSidebarLibraryList({
    playlistURL, 
    setPlaylistURL, 
    data, 
    setData,
    setTracksLoaded,
    tracksLoaded,
}){
    const [selectedOption, setSelectedOption] = useState('Recents');
    
    const [libraryTitle, setLibraryTitle] = useState(true);

    useEffect(() => {
        function handleResize() {
          setLibraryTitle(window.innerWidth > 1531 ? true : false);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        fetch('https://difficult-fly-sombrero.cyclic.app/items')
          .then((response) => response.json())
          .then((data) => setData(data))
          .catch((error) => console.error('Error fetching data:', error));
      }, []);

    

    return(
        <>
        <SimpleBar forceVisible="y" autoHide={true} style={{ maxHeight: '70vh' }}>
            <div className='library-list'>


                {libraryTitle &&<div className='library-search'>
                    <Tippy content='Search in your Library' arrow={false}>
                        <a href="" className='library-search-icon'><i className="fa-solid fa-magnifying-glass"></i></a>
                    </Tippy>
                    <div>
                        <select className='library-sortby' value={selectedOption} onChange={handleChange}>
                            <option value="Sort by" disabled>
                            Sort by
                            </option>
                            <option value="Recents">Recents</option>
                            <option value="Recently Added">Recently Added</option>
                            <option value="Alphabetical">Alphabetical</option>
                            <option value="Creator">Creator</option>
                            
                        </select>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </div>}

                <div className="imagecon">
                {data.map((item) => (
                    <div
                    key={item.id}
                    onClick={() => {
                      if (item.category === 'Playlist' && item.url !== playlistURL) {
                        setPlaylistURL(item.url);
                        setTracksLoaded(false);
                        setTimeout(() => {
                            setTracksLoaded(true);
                          }, 1000);
                      } 
                    }}
                    alt={item.url}
                    title={item.url}
                  >
                     
                        <img className={item.type == 'artist' ? 'artist' : ''} src={item.image} alt={item.name} />
                        <div>
                            <h4>{item.name}</h4>
                            <span className={item.category == 'Artist' ? 'artist' : ''}>{item.category} {((item.category == 'Playlist' && item.creator !== undefined) || (item.category == 'Album' && item.creator !== undefined)) && ' • '+item.creator}</span>
                        </div>
                        
                    </div>
                ))}
                </div>
                



            </div>
            </SimpleBar>
        </>
    )
}

LeftSidebarLibraryList.propTypes = {
    playlistURL: PropTypes.string.isRequired,
    setPlaylistURL: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired,
    setTracksLoaded: PropTypes.func.isRequired,
    tracksLoaded: PropTypes.bool.isRequired,
};