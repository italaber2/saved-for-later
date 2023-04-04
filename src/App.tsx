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

function BookmarkImg (img: string) {
  return (
    <div className='bookmarkImg'>
      <img src={img} width="100" height="50" alt='Bookmark thumbnail'/>
    </div>
  )
}

export const getBookmarkData = async (bookmarkLink: number) => {
  const response = await fetch(
    "https://jsonlink.io/api/extract?url=" + bookmarkLinks[bookmarkLink],
    {
      method: "GET",
    }
  );
  const myJson = await response.json();
  console.log(myJson)
  return myJson;
};

function SecondaryBookmark () {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData(arrayNumber: number) {
      const returnValue = await getBookmarkData(arrayNumber);
      setBookmarkData(returnValue);
    }
    for (let i = 0; i < bookmarkLinks.length; i++) {
      retrieveBookmarkData(i);
    } 
  }, []
  );

  return (
    <div className='secondaryBookmark'>
      {BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
      {BookmarkImg(bookmarkData.images as string)}
    </div>
  )
}

function PrimaryBookmark () {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData() {
      const returnValue = await getBookmarkData(0);
      setBookmarkData(returnValue);
    }
    retrieveBookmarkData();
  }, []
  );

  return (
    <div className='primaryBookmark'>
      {BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
      {BookmarkImg(bookmarkData.images as string)}
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

function PrimaryBookmarkViewport () {
  return (
    <div className='primaryBookmarkViewport'>
      <PrimaryBookmark/>
    </div>
  )
}

function BookmarkViewports () {
  return (
    <div className='bookmarksViewport'>
      <PrimaryBookmarkViewport/>
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
