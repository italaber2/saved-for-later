import { useEffect, useState } from "react";
import BookmarkImg from "./components/bookmarkImg";
import BookmarkText from "./components/bookmarkText";
import BookmarkButtons from "./components/bookmarkButtons";

interface BookmarkObject {
  id: string;
  url: string;
  title: string;
  parentId: string;
  dateAdded: number;
}

const numberOfDisplayedBookmarks: number = 5;

function App() {
  const [extractedBookmarks, setExtractedBookmarks] = useState([] as any);
  useEffect(() => {
    // calls the chrome api to get the bookmarks
    chrome.bookmarks.getTree((bookmarkTreeNodes: any) => {
      setExtractedBookmarks(extractBookmarks(bookmarkTreeNodes));
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
  async function scrapeMetadata(url: string) {
    const response = await fetch("https://jsonlink.io/api/extract?url=" + url, {
      method: "GET",
    });
    const metaData = await response.json();
    return metaData;
  }

  // sets the bookmark metadata into the objects to be rendered
  function SetMetadata(bookmarkData: BookmarkObject) {
    const [metaData, setMetaData] = useState({} as any);
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await scrapeMetadata(bookmarkData.url);
        setMetaData(returnValue);
      }
      retrieveBookmarkData();
    }, []);

    return (
      <div key={bookmarkData.id}>
        {BookmarkImg(metaData.images as string)}
        {BookmarkText(metaData.title as string, metaData.url as string)}
        {BookmarkButtons(
          metaData.url as string,
          metaData.title as string,
          bookmarkData.id as string,
          bookmarkData.parentId as string
        )}
      </div>
    );
  }

  // order the bookmarks by date added
  function OrderBookmarks() {
    extractedBookmarks.sort(
      (a: BookmarkObject, b: BookmarkObject) => a.dateAdded - b.dateAdded
    );
    const slicedBookmarks = extractedBookmarks.slice(
      0,
      numberOfDisplayedBookmarks
    );
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
