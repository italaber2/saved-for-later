//import React from 'react';
import { useEffect, useState } from 'react';
import { bookmarkLinks } from "./data";

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

function DumpBookmarks() {
  useEffect(() => {
    chrome.bookmarks.getTree((bookmarkTreeNodes: any) => {
      const bookmarks = extractBookmark(bookmarkTreeNodes);
      downloadBookmarks(bookmarks);
    });
  }, []);

  const extractBookmark: any = (nodes: any) => {
    let bookmarks: any = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.children) {
        bookmarks = bookmarks.concat(extractBookmark(node.children));
      } else {
        bookmarks.push({ title: node.title, url: node.url });
      }
    }

    return bookmarks;
  };

  const downloadBookmarks = (bookmarks: any) => {
    const content = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarks.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Bookmark Downloader</h1>
      <p>Click the button to download your bookmarks.</p>
      <button onClick={() => window.close()}>Close</button>
    </div>
  );
}

//figure out how to import bookmark data (Chrome documentation)
//need import bookmark function
//need sort bookmark data by six oldest function

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
      {BookmarkText(bookmarkData.title as string)}
      {BookmarkImg(bookmarkData.images as string)}
    </div>
  )
}

// function PrimaryBookmark () {
//   const [bookmarkData, setBookmarkData] = useState ({} as any)
//   useEffect(()=> {
//     async function retrieveBookmarkData() {
//       const firstBookmark = bookmarkLinks[0]
//       const returnValue = await getBookmarkData(firstBookmark);
//       setBookmarkData(returnValue);
//     }
//     retrieveBookmarkData();
//   }, []
//   );

//   return (
//     <>{BookmarkText(bookmarkData.title as string, bookmarkData.description as string)}
//     {BookmarkImg(bookmarkData.images as string)}</>
//   )
// }

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

// function PrimaryBookmarkViewport () {
//   return (
//     <div className='primaryBookmarkViewport'>
//       <PrimaryBookmark/>
//     </div>
//   )
// }

function BookmarkViewports () {
  return (
    <div className='bookmarksViewport'>
      {/* <PrimaryBookmarkViewport/> */}
      <SecondaryBookmarksViewport/>
    </div>
  )
}

// function NavBar () {
//   return (
//     <div className='navBar'>
//       Navigate me somewhere interesting
//     </div>
//   )
// }

function App() {
  return (
    <div className='mainViewport'>
      {/* <NavBar/> */}
      <BookmarkViewports/>
      </div>
  );
}

export default App;
