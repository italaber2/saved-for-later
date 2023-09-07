import React, { useEffect, useState } from "react";
import BookmarkImg from "./components/bookmarkImg";
import BookmarkText from "./components/bookmarkText";
import BookmarkError from "./components/bookmarkError";
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
    bookmarks.sort(
      (a: BookmarkObject, b: BookmarkObject) => a.dateAdded - b.dateAdded
    );
    bookmarks = bookmarks.slice(0, numberOfDisplayedBookmarks);
    return bookmarks;
  };

  // calls the api to scrape the desired bookmark metadata
  async function scrapeMetadata(bookmarkData: BookmarkObject) {
    try {
      const response = await fetch(
        "https://jsonlink.io/api/extract?url=" + bookmarkData.url,
        {
          method: "GET",
        }
      );
      const metaData = await response.json();
      if (metaData.error === "request timeout") {
        console.error("Request timeout for the bookmark " + bookmarkData.url);
        return {
          title: bookmarkData.title,
          images: "/assets/logo512.png",
          url: metaData.url,
          error: "418: Cannot brew coffee for " + bookmarkData.url,
        };
      } else if (metaData.images.length === 0) {
        console.error("Missimg image for " + bookmarkData.url);
        return {
          title: bookmarkData.title,
          images: "/assets/logo512.png",
          url: metaData.url,
          error: "Missimg image for " + bookmarkData.url,
        };
      } else if (metaData.title.length === 0) {
        console.error("Missimg title for " + bookmarkData.url);
        return {
          title: bookmarkData.title,
          images: "/assets/logo512.png",
          url: metaData.url,
          error: "Missimg title for " + bookmarkData.url,
        };
      }
      return metaData;
    } catch (error) {
      throw new Error("Failed to fetch data from the API: " + error);
    }
  }

  // sets the bookmark metadata into the objects to be rendered
  function Bookmark(bookmarkData: BookmarkObject) {
    const [metaData, setMetaData] = useState({} as any);
    useEffect(() => {
      async function retrieveBookmarkData() {
        const returnValue = await scrapeMetadata(bookmarkData);
        setMetaData(returnValue);
      }
      retrieveBookmarkData();
    }, []);

    return (
      <div key={bookmarkData.id}>
        <a href={bookmarkData.url} target="_blank" rel="noopener noreferrer">
          {BookmarkImg(metaData.images as string)}
          {BookmarkText(bookmarkData.title as string, metaData.url as string)}
        </a>
        <a href={bookmarkData.url} target="_blank" rel="noopener noreferrer">
          {metaData.error && BookmarkError(metaData.error as string)}
        </a>
        {BookmarkButtons(
          metaData.url as string,
          bookmarkData.title as string,
          bookmarkData.id as string,
          bookmarkData.parentId as string
        )}
      </div>
    );
  }

  // map the bookmark data into a list of bookmark components
  function Bookmarks() {
    const bookmarkList = extractedBookmarks.map((bookmarkData: any) => {
      return Bookmark(bookmarkData);
    });
    return <div className="bookmarksViewport">{bookmarkList}</div>;
  }

  return (
    <div className="mainViewport">
      <Bookmarks />
    </div>
  );
}

export default App;
