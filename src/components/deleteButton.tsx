import { handleDeleteBookmark } from "../utils";
import { useState, useEffect } from "react";
import { Stack, Button } from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";

function DeleteButton(id: string) {
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [componentKey, setComponentKey] = useState<number>(0);

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
          onClick={() => {
            handleDeleteBookmark(id, () => {
              setIsDeleted(true);
            });
          }}
          className="deleteButton"
          leftIcon={<RiDeleteBin6Line />}
          colorScheme="red"
          size="xs"
          variant="solid"
        >
          Delete
        </Button>
      </Stack>
    </div>
  );
}

export default DeleteButton;
