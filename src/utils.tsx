export const handleDeleteBookmark = (id: string, callback: () => void) => {
  chrome.bookmarks.remove(id, () => {
    console.log(`Bookmark with ID ${id} has been deleted.`);
    callback();
  });
};
