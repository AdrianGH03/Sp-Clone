// import React from 'react'
import { useState, useEffect } from 'react'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


export default function LeftSidebarLibrary(){
    const [libraryTitle, setLibraryTitle] = useState('');

    useEffect(() => {
        function handleResize() {
          setLibraryTitle(window.innerWidth > 1531 ? 'Your Library' : '');
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return(
        <>
            <div className='library'>


                <div className='library-header'>
                    <div className='library-manage'>
                        <Tippy content='Collapse Your Library' arrow={false}>
                            <h3 className='library-book'><a href=""><i className="fa-solid fa-book"></i>{libraryTitle}</a></h3>
                        </Tippy>
                        
                        <Tippy content='Create playlist or folder' arrow={false}>
                            <span>
                                <a href=""><i className="fa-solid fa-plus"></i></a>
                            </span>
                        </Tippy>
                        
                        <Tippy content='Enlarge Your Library' arrow={false}>
                            <span>
                                <a href=""><i className="fa-solid fa-arrow-right"></i></a>
                            </span>
                        </Tippy>
                        
                    </div>

                    <div className='library-filter'>
                        <button>Playlists</button>
                        <button>Artists</button>
                        <button>Albums</button>
                    </div>


                </div>

            </div>
        </>
    )
}


