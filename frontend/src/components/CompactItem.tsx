import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
  Box,
} from "@chakra-ui/react";
import { EditIcon, SearchIcon } from "@chakra-ui/icons";
import { IItem } from "../../../backend/models/itemSchema";

const CompactItem = ({ item }: { item: IItem }) => {
  // Note: Colors not added yet, just basic structure
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="More"
          icon={<SearchIcon />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{item.name}</PopoverHeader>
        <PopoverBody>
          <VStack alignItems="flex-end">
            <VStack alignItems="flex-start">
              <Box>Description: {item.notes}</Box>
              <Box>Quantity: {item.quantity}</Box>
              <Box>Price (per item): {item.price}</Box>
              {item.quantity > 1 ? <Box>{`\nTotal price: ${item.price * item.quantity}`}</Box> : ""}
              <Box>Viewability: {item.isPrivate ? "Public" : "Private"}</Box>
            </VStack>
            <IconButton aria-label="Edit item" icon={<EditIcon />} />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CompactItem;
