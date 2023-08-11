import { handleDeleteBookmark } from "../utils";
import { useState, useEffect } from "react";
import { Stack, Button } from "@chakra-ui/react";
import { RxReload } from "react-icons/rx";

function SaveForLaterButton(
  url: string,
  title: string,
  id: string,
  parentId: string
) {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [componentKey, setComponentKey] = useState<number>(0);
  const handleSaveBookmark = () => {
    window.chrome.bookmarks.create({ url, title, parentId }, () => {
      console.log("Bookmark saved successfully.");
    });
  };

  const handleSaveForLater = () => {
    handleSaveBookmark(); // Call the first function
    handleDeleteBookmark(id, () => {
      setIsDeleted(true);
    }); // Call the second function
  };

  useEffect(() => {
    if (isDeleted) {
      // Generate a new key when the bookmark is deleted to refresh the component
      setComponentKey((prevKey) => {
        return prevKey + 1;
      });
    }
  }, [isDeleted]);

  if (isDeleted) {
    // Reload the component when the key changes
    window.location.reload();
  }

  return (
    <div key={componentKey}>
      <Stack direction="row" spacing={4}>
        <Button
          className="saveForLater"
          onClick={handleSaveForLater}
          leftIcon={<RxReload />}
          colorScheme="green"
          size="sm"
          variant="solid"
        >
          Save for later
        </Button>
      </Stack>
    </div>
  );
}

export default SaveForLaterButton;
