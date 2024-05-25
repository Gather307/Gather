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
import { IGroup } from "../../../backend/models/groupSchema";
import { IBasket } from "../../../backend/models/basketSchema";
import { IItem } from "../../../backend/models/itemSchema";
import { useEffect } from "react";

type Props = {
  group: IGroup;
  stateVariable: any;
};

const ItemGroup: React.FC<Props> = ({
  group,
  stateVariable,
}: {
  group: IGroup;
  stateVariable: any;
}) => {
  const [items, setItems] = React.useState<IItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const category = group.groupName;

  const fetchBaskets = async (group: IGroup) => {
    const basketPromises = group.baskets.map(async (basket) => {
      const res = await fetch(`http://localhost:3001/baskets/${basket}`);
      if (res.status === 200) {
        const data = await res.json();
        return data;
      } else {
        console.log("error");
      }
    });

    const tempBaskets = (await Promise.all(basketPromises)) as IBasket[];
    return tempBaskets;
  };

  const fetchItems = async (basket: IBasket) => {
    console.log(basket);
    if (basket.items.length === 0) {
      return [];
    }
    const itemPromises = basket.items.map(async (item) => {
      const res = await fetch(`http://localhost:3001/items/${item}`);
      if (res.status === 200) {
        const data = await res.json();
        return data;
      }
    });

    const tempItems = await Promise.all(itemPromises);
    return tempItems;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (stateVariable.user) {
        const fetchedBaskets = await fetchBaskets(group);
        const tempItems: IItem[] = [];

        for (const basket of fetchedBaskets) {
          const fetchedItems = await fetchItems(basket);
          tempItems.push(...fetchedItems);
        }

        setItems(tempItems);
        setLoading(false);
      }
    };

    fetchAllData().catch((err) => {
      console.log(`Error occurred: ${err}`);
      setLoading(false);
    });
  }, [stateVariable.user]);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      width="full"
      mb={4}
      bg="white"
    >
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
          {!loading && items.length > 0 ? (
            (console.log("here", items),
            items.map((item, index) => (
              <Tr key={index}>
                <Td width="25%">{item.name}</Td>
                <Td width="50%">{item.notes}</Td>
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
            )))
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
