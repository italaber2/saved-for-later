import { useEffect, useState } from "react";
import BookmarkImg from "./components/bookmarkImg";
import BookmarkText from "./components/bookmarkText";
import DeleteButton from "./components/deleteButton";
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
    console.log("🚀 ~ file: App.tsx:44 ~ App ~ bookmarks:", bookmarks);
    return bookmarks;
  };
  // calls the api to get bookmark metadata
  async function getBookmarkData(bookmarkObject: BookmarkObject) {
    try {
      const response = await fetch(
        "https://jsonlink.io/api/extract?url=" + bookmarkObject.url,
        {
          method: "GET",
        }
      );
      const myJson = await response.json();
      console.log("🚀 ~ file: App.tsx:56 ~ getBookmarkData ~ myJson:", myJson);
      if (myJson.error === "request timeout") {
        console.error(
          "Uh oh! Request timeout for the bookmark " + bookmarkObject.url
        );
        //set a generic bookmark for the error that returns the error message as the title
        return myJson;
      }
      return myJson;
    } catch (error) {
      throw new Error("Failed to fetch data from the API: " + error);
    }
  }

  function Bookmark(bookmarkObject: BookmarkObject) {
    const [bookmarkData, setBookmarkData] = useState({} as any);
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await getBookmarkData(bookmarkObject);
        console.log(
          "🚀 ~ file: App.tsx:74 ~ retrieveBookmarkData ~ returnValue:",
          returnValue
        );
        setBookmarkData(returnValue);
      }
      retrieveBookmarkData();
    }, []);

    return (
      <div className="bookmark" key={bookmarkObject.url}>
        {BookmarkImg(bookmarkData.images as string)}
        {BookmarkText(bookmarkData.title as string, bookmarkData.url as string)}
        {DeleteButton(bookmarkObject.id as string)}
        {SaveForLaterButton(
          bookmarkData.url as string,
          bookmarkData.title as string,
          bookmarkObject.id as string,
          bookmarkObject.parentId as string
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
