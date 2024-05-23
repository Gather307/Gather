import React from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, DeleteIcon } from "@chakra-ui/icons";

type Item = {
  name: string;
  description: string;
};

type ItemGroupProps = {
  category: string;
  items: Item[];
};

const ItemGroup: React.FC<ItemGroupProps> = ({ category, items }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" width="full" mb={4}>
      <Heading as="h2" size="md">
        {category}
      </Heading>
      <Divider mt={2} mb={4} />
      <Table variant="simple" width="full">
        <Thead>
          <Tr>
            <Th width="25%">Name</Th>
            <Th width="50%">Description</Th>
            <Th width="8%">More</Th>
            <Th width="8%">Move</Th>
            <Th width="9%">Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <Tr key={index}>
                <Td width="25%">{item.name}</Td>
                <Td width="50%">{item.description}</Td>
                <Td width="8%">
                  <IconButton
                    aria-label="More"
                    icon={<SearchIcon />}
                    isDisabled
                  />
                </Td>
                <Td width="8%">
                  <IconButton
                    aria-label="Move"
                    icon={<SearchIcon />}
                    isDisabled
                  />
                </Td>
                <Td width="9%">
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    isDisabled
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={5}>No items found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ItemGroup;
