import { useEffect, useState } from "react";
import BookmarkImg from "./components/bookmarkImg";
import BookmarkText from "./components/bookmarkText";
import DeleteButton from "./components/deleteButton";
import LoadingSkeleton from "./components/loadingSkeleton";
//https://chat.openai.com/share/e700bbce-885e-4392-bd62-c1ec3dd437b1 (for loading skeleton)

import SaveForLaterButton from "./components/saveForLaterButton";

interface BookmarkObject {
  id: string;
  url: string;
  title: string;
  parentId: string;
  dateAdded: number;
}

const numberOfDisplayedBookmarks: number = 5;

function App() {
  // calls the api to get bookmark metadata
  const [bookmarkLinks, setBookmarkLinks] = useState([] as any);
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
        bookmarks.push({
          id: node.id,
          url: node.url,
          title: node.title,
          parentId: node.parentId,
          dateAdded: node.dateAdded,
        });
      }
    }
    return bookmarks;
  };
  // calls the api to get bookmark metadata
  async function getBookmarkData(bookmarkObject: BookmarkObject) {
    const response = await fetch(
      "https://jsonlink.io/api/extract?url=" + bookmarkObject.url,
      {
        method: "GET",
      }
    );
    const myJson = await response.json();
    return myJson;
  }

  function Bookmark(bookmarkObject: BookmarkObject) {
    const [bookmarkData, setBookmarkData] = useState({} as any);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await getBookmarkData(bookmarkObject);
        setBookmarkData(returnValue);
        setIsLoading(false);
      }
      retrieveBookmarkData();
    }, []);

    // return <div>{isLoading ? <LoadingSkeleton /> : /* Render your actual content here using 'data' */}</div>;
    // };

    return (
      <div className="bookmark" key={bookmarkObject.url}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {BookmarkImg(bookmarkData.images as string)}
            {BookmarkText(
              bookmarkData.title as string,
              bookmarkData.url as string
            )}
            {DeleteButton(bookmarkObject.id as string)}
            {SaveForLaterButton(
              bookmarkData.url as string,
              bookmarkData.title as string,
              bookmarkObject.id as string,
              bookmarkObject.parentId as string
            )}
          </>
        )}
      </div>
    );
  }

  function BookmarkViewport() {
    bookmarkLinks.sort(
      (a: BookmarkObject, b: BookmarkObject) => a.dateAdded - b.dateAdded
    );
    const slicedBookmarkLinks = bookmarkLinks.slice(
      0,
      numberOfDisplayedBookmarks
    );
    const bookmarkComponents = slicedBookmarkLinks.map((bookmarkLink: any) => {
      return Bookmark(bookmarkLink);
    });
    return <div className="bookmarksViewport">{bookmarkComponents}</div>;
  }

  return (
    <div className="mainViewport">
      <BookmarkViewport />
    </div>
  );
}

export default App;
