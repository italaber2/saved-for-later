//import React from 'react';
import { useEffect, useState } from 'react';

interface BookmarkObject {
  title: string,
  url: string,
  dateAdded: number
 }

//general refactoring
//figure out why the new bookmark isn't working
//refine bookmark search by oldest + only oldest 6 elements
//clickable links

function App() {
const [bookmarkLinks, setBookmarkLinks] = useState ([] as any)
  useEffect(() => {
    chrome.bookmarks.getTree((bookmarkTreeNodes: any) => {
      setBookmarkLinks(extractBookmark(bookmarkTreeNodes));
    });
  }, []);

  const extractBookmark: any = (nodes: any) => {
    let bookmarks: any = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.children) {
        bookmarks = bookmarks.concat(extractBookmark(node.children));
      } else {
        bookmarks.push({ title: node.title, url: node.url, dateAdded: node.dateAdded });
      }
    }

    return bookmarks;
  };

function BookmarkText (title: string) {
  return (
    <div className='bookmarkText'>
      <p id='bookmarkTitle'>{title}</p>
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

async function getBookmarkData (bookmarkObject: BookmarkObject) {
  const response = await fetch(
    "https://jsonlink.io/api/extract?url=" + bookmarkObject.url,
    {
      method: "GET",
    }
  );
  const myJson = await response.json();
  return myJson;
};

function SecondaryBookmark (bookmarkObject: BookmarkObject) {
  const [bookmarkData, setBookmarkData] = useState ({} as any)
  useEffect(()=> {
    async function retrieveBookmarkData() {
      const returnValue = await getBookmarkData(bookmarkObject);
      setBookmarkData(returnValue);
    }
      retrieveBookmarkData();
  }, []
  );

  return (
    <div className='secondaryBookmark' key={bookmarkObject.url}>
      {BookmarkText(bookmarkData.title as string)}
      {BookmarkImg(bookmarkData.images as string)}
    </div>
  )
}

function SecondaryBookmarksViewport () {
  const slicedBookmarkLinks = bookmarkLinks;
  console.log(slicedBookmarkLinks);
  // Need to fix multiple calls as documented above
  const bookmarkComponents = slicedBookmarkLinks.map((bookmarkLink:any)=> {
      return SecondaryBookmark(bookmarkLink)
     }
    )
  return (
    <div className='secondaryBookmarksViewport'>
      {bookmarkComponents}
    </div>
  )
}

function BookmarkViewports () {
  return (
    <div className='bookmarksViewport'>
      <SecondaryBookmarksViewport/>
    </div>
  )
}

  return (
    <div className='mainViewport'>
      <BookmarkViewports/>
      </div>
  );
}

 export default App;
