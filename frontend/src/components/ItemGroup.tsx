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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  TableContainer,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaChevronDown } from "react-icons/fa";
import { IGroup } from "../../../backend/models/groupSchema";
import { IBasket } from "../../../backend/models/basketSchema";
import { IItem } from "../../../backend/models/itemSchema";
import { useEffect } from "react";
import EditItem from "./EditItem";
import NewItemOptions from "./NewItemOptions";

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
  const [baskets, setBaskets] = React.useState<IBasket[]>([]);
  const [basket, setBasket] = React.useState<IBasket>();
  const [userBaskets, setUserBaskets] = React.useState<IBasket[]>([]);
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

  const fetchUserBaskets = async () => {
    const res = await fetch("http://localhost:3001/baskets");
    if (res.status === 200) {
      const allBaskets = await res.json();
      const userBaskets = [] as IBasket[]
      for (const basket of allBaskets) {
        if (basket.members.includes(stateVariable.user._id)) {
          userBaskets.push(basket);
        }
      }
      setUserBaskets(userBaskets);
    }
  };

  const fetchItems = async (basket: IBasket) => {
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
        setBaskets(fetchedBaskets);
        setBasket(fetchedBaskets[0]);
        const tempItems: IItem[] = [];

        for (const basket of fetchedBaskets) {
          const fetchedItems = await fetchItems(basket);
          tempItems.push(...fetchedItems);
        }
        fetchUserBaskets().then(() => {
          console.log("userBaskets: ", userBaskets)
          setItems(tempItems);
          setLoading(false);
        });
      }
    };

    fetchAllData().catch((err) => {
      console.log(`Error occurred: ${err}`);
      setLoading(false);
    });
  }, [stateVariable.user]);

  useEffect(() => {
    if (basket) {
      setBaskets([basket, ...baskets.slice(1)]);
    }
  }, [basket]);

  const removeItem = async (item: IItem) => {
    baskets.forEach(async (basket) => {
      if (basket.items.includes(item._id)) {
        const newItems = basket.items.filter((i) => i !== item._id);
        const res = await fetch(`http://localhost:3001/baskets/${basket._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${stateVariable.token}`,
          },
          body: JSON.stringify({ items: newItems }),
        });
        if (res.status === 200) {
          const res = await fetch(`http://localhost:3001/items/${item._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${stateVariable.token}`,
            },
          });
          if (res.status === 200) {
            const newItems = items.filter((i) => i._id !== item._id);
            setItems(newItems);
          }
        }
      }
    });
    window.location.reload();
  };

  const moveItem = async (basket: IBasket, item: IItem) => {
    try {
      console.log(userBaskets)
      const itemBasket = userBaskets.find((b) => b._id === item.basket);
      console.log(itemBasket)
      const newBasketsItems = itemBasket?.items.filter((i) => i !== item._id);
      const removeItemFromBasket = await fetch(
        `http://localhost:3001/baskets/${item.basket}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${stateVariable.token}`,
          },
          body: JSON.stringify({
            items: newBasketsItems,
          }),
        },
      );
      if (removeItemFromBasket.ok) {
        console.log("Item removed from basket successfully");
      } else {
        console.error("Failed to remove item");
      }
      const updatedItem = await fetch(
        `http://localhost:3001/items/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${stateVariable.token}`,
          },
          body: JSON.stringify({ basket: basket._id }),
        },
      );
      if (updatedItem.ok) {
        console.log("Item added to basket successfully");
      } else {
        console.error("Failed to update item");
      }
      const updatedBasket = await fetch(
        `http://localhost:3001/baskets/${basket._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${stateVariable.token}`,
          },
          body: JSON.stringify({ items: [...basket.items, item._id] }),
        },
      );
      if (updatedBasket.ok) {
        console.log("Item added to basket successfully");
      } else {
        console.error("Failed to update basket");
      }
    } catch (error) {
      console.error("Error moving item:", error);
    }
  };

  const handleMove = async (basket: IBasket, item: IItem) => {
    try {
      console.log(`Basket ID: ${basket._id} clicked`);
      console.log(`Item ID: ${item._id} clicked`);
      await moveItem(basket, item);
      window.location.reload();
    } catch (error) {
      console.error("Invalid user ID");
    }
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      width="full"
      mb={4}
      bg="white"
    >
      <Box justifyContent={"space-between"} display="flex">
        <Heading as="h2" size="md">
          {category}
        </Heading>
        <Box display="flex" alignItems="center">
            { !loading && baskets.length > 0 ? ( 
              <NewItemOptions 
                basket={baskets[0]._id.toString()} 
                updateBasket={setBasket} 
              />
            ) : (
              <Heading as="h3" fontWeight="normal" size="sm" marginRight="10px">
                No baskets available
              </Heading>
            )
            }
        </Box>
      </Box>
      <Divider mt={2} mb={4} />
      <TableContainer>
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
              items.map((item, index) => (
                <Tr key={index}>
                  <Td width="25%">{item.name}</Td>
                  <Td width="50%">{item.notes}</Td>
                  <Td width="8%">
                    <EditItem itemId={item._id.toString()} />
                  </Td>
                  <Td width="8%">
                    <Menu>
                      <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                        Select Basket
                      </MenuButton>
                      <MenuList>
                        {userBaskets.length > 0 ? (
                          console.log(userBaskets),
                          userBaskets.map((basket) => (
                            <MenuItem
                              key={basket._id.toString()}
                              onClick={() => handleMove(basket, item)}
                              _hover={{ textColor: "black" }}
                            >
                              {basket.basketName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No baskets available</MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td width="9%">
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => removeItem(item)}
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
      </TableContainer>
    </Box>
  );
};

export default ItemGroup;
