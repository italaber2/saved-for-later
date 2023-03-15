//import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { bookmarkLinks } from "./data";

function BookmarkText (title: string, description: string) {
  return (
    <div className='bookmarkText'>
      <p id='title'>{title}</p>
      <p id='description'>{description}</p>  
    </div>
  )
}

function BookmarkImg () {
  return (
    <div>
      <img id='img' alt='article thumbnail'/>
    </div>
  )
}

export const getBookmarkData = async () => {
  const response = await fetch(
    "https://jsonlink.io/api/extract?url=" + bookmarkLinks[3],
    {
      method: "GET",
    }
  );
  const myJson = await response.json();
  return myJson;
};

function SecondaryBookmark () {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData() {
      const returnValue = await getBookmarkData();
      setBookmarkData(returnValue);
    }
    retrieveBookmarkData();
  }, []
  );
  
  return (
    <div className='secondaryBookmark'>
      <BookmarkImg/>
      {BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
    </div>
  )
}

function SecondaryBookmarksViewport () {
  return (
    <div className='secondaryBookmarksViewport'>
      <SecondaryBookmark/>
      <SecondaryBookmark/>
      <SecondaryBookmark/>
      <SecondaryBookmark/>
      <SecondaryBookmark/>
      <SecondaryBookmark/>
    </div>
  )
}

function PrimaryBookmark () {
  return (
    <div className='primaryBookmarkViewport'>
      <BookmarkImg/>
    </div>
  )
}

function BookmarkViewports () {
  return (
    <div className='bookmarksViewport'>
      <PrimaryBookmark/>
      <SecondaryBookmarksViewport/>
    </div>
  )
}

function NavBar () {
  return (
    <div className='navBar'>
      Navigate me somewhere interesting
    </div>
  )
}

function App() {
  return (
    <div className='mainViewport'>
      Insert Catchy Title + Logo Here
      <NavBar/>
      <BookmarkViewports/>
      </div>
  );
}

export default App;
