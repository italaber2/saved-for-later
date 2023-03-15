import { bookmarkLinks } from "./data";

export const displayBookmark = async () => {
  const response = await fetch(
    "https://jsonlink.io/api/extract?url=" + bookmarkLinks[3],
    {
      method: "GET",
    }
  );
  console.log(bookmarkLinks[0]);
  const myJson = await response.json();
  const imageSrc = document.getElementById("img") as HTMLImageElement;
  imageSrc.src = myJson.images;
  document.getElementById("title")!.innerHTML = myJson.title;
  document.getElementById("description")!.innerHTML = myJson.description;
};
