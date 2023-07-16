import { Stack, Button } from "@chakra-ui/react";
import { RiDeleteBin6Line } from "react-icons/ri";

function deleteButton() {
  return (
    <div>
      <Stack direction="row" spacing={4}>
        <Button
          leftIcon={<RiDeleteBin6Line />}
          colorScheme="red"
          variant="solid"
        >
          Delete
        </Button>
      </Stack>
    </div>
  );
}

export default deleteButton;
