import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

interface Props {
  name: string;
  desc: string;
  quant: number;
  price: number;
  pub: boolean;
  assigned: boolean;
}

const CompactItem = ({ name, desc, quant, price, pub, assigned }: Props) => {
  // Note: Colors not added yet, just basic structure
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Some clickable item component / more button</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{name}</PopoverHeader>
        <PopoverBody>
          <VStack alignItems="flex-end">
            <VStack alignItems="flex-start">
              <Box>Description: {desc}</Box>
              <Box>Quantity: {quant}</Box>
              <Box>Price (per item): {price}</Box>
              {quant > 1 ? <Box>{`\nTotal price: ${price * quant}`}</Box> : ""}
              <Box>Viewability: {pub ? "Public" : "Private"}</Box>
            </VStack>
            <IconButton aria-label="Edit item" icon={<EditIcon />} />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CompactItem;
