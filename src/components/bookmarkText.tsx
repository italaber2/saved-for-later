function BookmarkText(title: string, url: string) {
  return (
    <div className="bookmarkText">
      <a
        id="bookmarkTitle"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    </div>
  );
}

export default BookmarkText;
