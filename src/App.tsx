import { useEffect, useState } from "react";
import BookmarkImg from "./components/bookmarkImg";
import BookmarkText from "./components/bookmarkText";
import DeleteButton from "./components/deleteButton";
import SaveForLaterButton from "./components/saveForLaterButton";

interface BookmarkObject {
  title: string;
  url: string;
  dateAdded: number;
}

const numberOfDisplayedBookmarks: number = 6;

function App() {
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
          title: node.title,
          url: node.url,
          dateAdded: node.dateAdded,
        });
      }
    }
    return bookmarks;
  };

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
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await getBookmarkData(bookmarkObject);
        setBookmarkData(returnValue);
      }
      retrieveBookmarkData();
    }, []);

    return (
      <div className="bookmark" key={bookmarkObject.url}>
        {BookmarkImg(bookmarkData.images as string)}
        {BookmarkText(bookmarkData.title as string, bookmarkData.url as string)}
        <DeleteButton />
        <SaveForLaterButton />
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
    console.log(slicedBookmarkLinks);
    const bookmarkComponents = slicedBookmarkLinks.map((bookmarkLink: any) => {
      return Bookmark(bookmarkLink);
    });
    return <div className="bookmarksViewport">{bookmarkComponents}</div>;
  }

  function Container() {
    return (
      <div className="container">
        <BookmarkViewport />
      </div>
    );
  }

  return (
    <div className="mainViewport">
      <Container />
    </div>
  );
}

export default App;
