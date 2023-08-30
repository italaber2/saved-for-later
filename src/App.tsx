import React, { useEffect, useState } from "react";
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
    bookmarks.sort(
      (a: BookmarkObject, b: BookmarkObject) => a.dateAdded - b.dateAdded
    );
    bookmarks = bookmarks.slice(0, numberOfDisplayedBookmarks);
    console.log("🚀 ~ file: App.tsx:48 ~ App ~ bookmarks:", bookmarks);
    return bookmarks;
  };

  // calls the api to scrape the desired bookmark metadata
  async function scrapeMetadata(url: string) {
    try {
      const response = await fetch(
        "https://jsonlink.io/api/extract?url=" + url,
        {
          method: "GET",
        }
      );
      const metaData = await response.json();
      if (metaData.error === "request timeout") {
        console.error("Request timeout for the bookmark " + metaData.url);
        return {
          title: "418: Cannot brew coffee for " + metaData.url,
          images: "/assets/logo512.png",
          url: metaData.url,
        };
      } else if (metaData.images.length === 0) {
        console.error("Missimg image for " + metaData.url);
        return {
          title: "Missing image for " + metaData.url,
          images: "/assets/logo512.png",
          url: metaData.url,
        };
      } else if (metaData.title.length === 0) {
        console.error("Missimg title for " + metaData.url);
        return {
          title: "Missing title for " + metaData.url,
          images: "/assets/logo512.png",
          url: metaData.url,
        };
      }
      return metaData;
    } catch (error) {
      throw new Error("Failed to fetch data from the API: " + error);
    }
  }

  // sets the bookmark metadata into the objects to be rendered
  // const Bookmark = React.memo(function BookmarkComponent(
  //   bookmarkData: BookmarkObject
  // ) {
  //   const [metaData, setMetaData] = useState<any | null>(null);
  //   useEffect(() => {
  //     async function retrieveBookmarkData() {
  //       const returnValue = await scrapeMetadata(bookmarkData.url);
  //       setMetaData(returnValue);
  //     }
  //     retrieveBookmarkData();
  //   }, []);

  //   return (
  //     <div key={bookmarkData.id}>
  //       {BookmarkImg(metaData.images as string)}
  //       {BookmarkText(metaData.title as string, metaData.url as string)}
  //       {BookmarkButtons(
  //         metaData.url as string,
  //         metaData.title as string,
  //         bookmarkData.id as string,
  //         bookmarkData.parentId as string
  //       )}
  //     </div>
  //   );
  // });

  function Bookmark(bookmarkData: BookmarkObject) {
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
