import React from 'react'
import { useState } from 'react'

export default function TopLeftMenu(){
    return(
        <>
            <div className='top-left-menu'>
                <h3 className="top-left-home"><a href=""><i className="fa-sharp fa-solid fa-house"></i>Home</a></h3>
                <h3 className="top-left-search"><a href=""><i className="fa-solid fa-magnifying-glass"></i>Search</a></h3>
            </div>
        </>
    )
}