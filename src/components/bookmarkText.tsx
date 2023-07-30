function BookmarkText(title: string, url: string) {
  return (
    <div>
      <a
        className="bookmarkTitle"
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
