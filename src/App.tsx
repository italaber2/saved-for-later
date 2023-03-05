//import React from 'react';
import './App.css';
import { userAction } from './logic';

<body onLoad={userAction}></body>

function BookmarkText () {
  return (
    <div className='bookmarkText' onClick={userAction}>
     <p id='text'>Placeholder text</p> 
    </div>
  )
}

function BookmarkImg () {
  return (
    <div> Image goes here
    </div>
  )
}

function SecondaryBookmark () {
  return (
    <div className='secondaryBookmark'>
      <BookmarkImg/>
      <BookmarkText/>
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
    <div className='primaryBookmarkViewport' onClick={userAction}>
      <BookmarkImg/>
      <BookmarkText/>
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
