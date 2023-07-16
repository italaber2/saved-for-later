import { Stack, Button } from "@chakra-ui/react";
import { IoIosRefresh } from "react-icons/io";

function saveForLaterButton() {
  return (
    <div>
      <Stack direction="row" spacing={4}>
        <Button leftIcon={<IoIosRefresh />} variant="solid">
          Save for later
        </Button>
      </Stack>
    </div>
  );
}

export default saveForLaterButton;
