function BookmarkImg(img: string) {
  return (
    <div className="bookmarkImg">
      <img
        id="thumbnailImg"
        src={img}
        width="100"
        height="50"
        alt="Bookmark thumbnail"
      />
    </div>
  );
}

export default BookmarkImg;
