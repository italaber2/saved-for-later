//import React from 'react';
import { useEffect, useState } from 'react';
import '../style/app.css';
import { bookmarkLinks } from "./data";

function BookmarkText (title: string, description: string) {
  return (
    <div className='bookmarkText'>
      <p id='bookmarkTitle'>{title}</p>
      <p id='bookmarkDescription'>{description}</p>  
    </div>
  )
}

function BookmarkImg (img: string) {
  return (
    <div className='bookmarkImg'>
      <img id='thumbnailImg' src={img} width="100" height="50" alt='Bookmark thumbnail'/>
    </div>
  )
}

async function getBookmarkData (bookmarkUrl: string) {
  const response = await fetch(
    "https://jsonlink.io/api/extract?url=" + bookmarkUrl,
    {
      method: "GET",
    }
  );
  const myJson = await response.json();
  return myJson;
};

function SecondaryBookmark (bookmarkUrl: string) {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData() {
      const returnValue = await getBookmarkData(bookmarkUrl);
      setBookmarkData(returnValue);
    }
      retrieveBookmarkData();
  }, []
  );

  return (
    <div className='secondaryBookmark' key={bookmarkUrl}>
      {BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
      {BookmarkImg(bookmarkData.images as string)}
    </div>
  )
}

function PrimaryBookmark () {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData() {
      const firstBookmark = bookmarkLinks[0]
      const returnValue = await getBookmarkData(firstBookmark);
      setBookmarkData(returnValue);
    }
    retrieveBookmarkData();
  }, []
  );

  return (
    <>{BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
    {BookmarkImg(bookmarkData.images as string)}</>
  )
}

function SecondaryBookmarksViewport () {
  const slicedBookmarkLinks = bookmarkLinks.slice(1);
  console.log(slicedBookmarkLinks);
  // Need to fix multiple calls as documented above
  const bookmarkComponents = slicedBookmarkLinks.map((bookmarkLink)=> {
      return SecondaryBookmark(bookmarkLink)
     }
    )
  return (
    <div className='secondaryBookmarksViewport'>
      {bookmarkComponents}
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

