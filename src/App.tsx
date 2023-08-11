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
  // calls the chrome api to get the bookmarks
  const [Bookmarks, setBookmarks] = useState([] as any);
  useEffect(() => {
    chrome.bookmarks.getTree((bookmarkTreeNodes: any) => {
      setBookmarks(extractBookmarks(bookmarkTreeNodes));
    });
  }, []);

  // extracts the bookmarks with the defined parameters
  const extractBookmarks: any = (nodes: any) => {
    let bookmarks: any = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.children) {
        bookmarks = bookmarks.concat(extractBookmarks(node.children));
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

  // calls the api to scrape the desired bookmark metadata
  async function scrapeMetadata(objectData: BookmarkObject) {
    const response = await fetch(
      "https://jsonlink.io/api/extract?url=" + objectData.url,
      {
        method: "GET",
      }
    );
    const myJson = await response.json();
    return myJson;
  }

  // sets the bookmark metadata into the objects to be rendered
  function SetMetadata(objectData: BookmarkObject) {
    const [bookmarkData, setData] = useState({} as any);
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await scrapeMetadata(objectData);
        setData(returnValue);
      }
      retrieveBookmarkData();
    }, []);

    return (
      <div className="bookmark" key={objectData.url}>
        {BookmarkImg(bookmarkData.images as string)}
        {BookmarkText(bookmarkData.title as string, bookmarkData.url as string)}
        {DeleteButton(objectData.id as string)}
        {SaveForLaterButton(
          bookmarkData.url as string,
          bookmarkData.title as string,
          objectData.id as string,
          objectData.parentId as string
        )}
      </div>
    );
  }

  // order the bookmarks by date added
  function OrderBookmarks() {
    Bookmarks.sort(
      (a: BookmarkObject, b: BookmarkObject) => a.dateAdded - b.dateAdded
    );
    const slicedBookmarks = Bookmarks.slice(0, numberOfDisplayedBookmarks);
    const reorderedBookmarks = slicedBookmarks.map((bookmark: any) => {
      return SetMetadata(bookmark);
    });
    return <div className="bookmarksViewport">{reorderedBookmarks}</div>;
  }

  return (
    <div className="mainViewport">
      <OrderBookmarks />
    </div>
  );
}

export default App;
