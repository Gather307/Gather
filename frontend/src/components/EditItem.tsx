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
  FormControl,
  FormLabel,
  Input,
  Box,
  HStack,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import {} from "@chakra-ui/react";

//Add Radio for boolean
//Number input for number type

interface Props {
  itemId: string;
}

const EditItem: React.FC<Props> = ({ itemId }) => {
  // Note: Colors not added yet, just basic structure
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedQuant, setEditedQuant] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedPub, setEditedPub] = useState("");
  const [editedSharable, setEditedSharable] = useState("");
  const [ItemData, setItemData] = useState({
    itemId: "",
    itemName: "",
    itemDesc: "",
    itemQuant: "",
    itemPrice: "",
    itemPub: "",
    itemSharable: "",
  });

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/items/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setItemData({
            itemId: data.itemId,
            itemName: data.name,
            itemDesc: data.notes,
            itemQuant: data.quantity,
            itemPrice: data.price,
            itemPub: data.isPrivate,
            itemSharable: data.toShare,
          });
          setEditedName(data.name);
          setEditedDesc(data.notes);
          setEditedQuant(data.quantity);
          setEditedPrice(data.price);
          setEditedPub(data.isPrivate);
          setEditedSharable(data.toShare);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchItemData();
  }, [itemId]);

  const format = (val: any) => `$` + val;
  const parse = (val: any) => val.replace(/^\$/, "");

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("There was an error deleting the item", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedItem = {
        name: editedName,
        notes: editedDesc,
        toShare: editedSharable,
        isPrivate: editedPub,
        price: editedPrice,
        quantity: editedQuant,
      };
      console.log(updatedItem);
      const response = await fetch(`http://localhost:3001/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setItemData((prev) => ({
          ...prev,
          itemName: updatedItem.name,
          itemDesc: updatedItem.notes,
          itemQuant: updatedItem.quantity,
          itemPrice: updatedItem.price,
          itemPub: updatedItem.isPrivate,
          itemSharable: updatedItem.toShare,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="More" icon={<SearchIcon />} />
      </PopoverTrigger>

      <PopoverContent
        bg="var(--col-bright)"
        color="var(--col-dark)"
        border="2px"
        borderColor="var(--col-dark)"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader
          fontWeight="bold"
          bg="var(--col-brighter)"
          color="var(--col-dark)"
          fontSize="xl"
        >
          {ItemData.itemName}
        </PopoverHeader>
        <PopoverBody>
          <VStack alignItems="flex-left">
            <VStack alignItems="flex-start">
              {isEditing ? (
                <>
                  <FormControl>
                    <FormLabel fontWeight="bold">Item Name</FormLabel>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      borderColor="var(--col-dark)"
                      focusBorderColor="var(--col-bright)"
                      _hover={{ bg: "var(--col-tertiary)" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold">Description</FormLabel>
                    <Input
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      borderColor="var(--col-dark)"
                      focusBorderColor="var(--col-bright)"
                      _hover={{ bg: "var(--col-tertiary)" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold">Quantity</FormLabel>
                    <Input
                      value={editedQuant}
                      onChange={(e) => setEditedQuant(e.target.value)}
                      borderColor="var(--col-dark)"
                      focusBorderColor="var(--col-bright)"
                      _hover={{ bg: "var(--col-tertiary)" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold">Price</FormLabel>
                    <NumberInput
                      onChange={(valueString) =>
                        setEditedPrice(parse(valueString))
                      }
                      value={format(editedPrice)}
                      max={100000}
                    >
                      <NumberInputField
                        fontWeight="bold"
                        borderColor="var(--col-dark)"
                        _hover={{ bg: "var(--col-tertiary)" }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold">Visible to Others?</FormLabel>
                    <RadioGroup onChange={setEditedPub} value={editedPub}>
                      <Stack direction="row">
                        <Radio
                          value="false"
                          borderColor="var(--col-dark)"
                          _checked={{
                            borderColor: "var(--col-bright)",
                            bg: "var(--col-bright)",
                            color: "var(--col-dark)",
                            _before: {
                              content: '""',
                              display: "inline-block",
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              bg: "var(--col-dark)",
                            },
                          }}
                          _hover={{ bg: "var(--col-tertiary)" }}
                        >
                          Public
                        </Radio>
                        <Radio
                          value="true"
                          borderColor="var(--col-dark)"
                          _checked={{
                            borderColor: "var(--col-bright)",
                            bg: "var(--col-bright)",
                            color: "var(--col-dark)",
                            _before: {
                              content: '""',
                              display: "inline-block",
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              bg: "var(--col-dark)",
                            },
                          }}
                          _hover={{ bg: "var(--col-tertiary)" }}
                        >
                          Private
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold">Sharable?</FormLabel>
                    <RadioGroup
                      onChange={setEditedSharable}
                      value={editedSharable}
                    >
                      <Stack direction="row">
                        <Radio
                          value="true"
                          borderColor="var(--col-dark)"
                          _checked={{
                            borderColor: "var(--col-bright)",
                            bg: "var(--col-bright)",
                            color: "var(--col-dark)",
                            _before: {
                              content: '""',
                              display: "inline-block",
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              bg: "var(--col-dark)",
                            },
                          }}
                          _hover={{ bg: "var(--col-tertiary)" }}
                        >
                          Yes
                        </Radio>
                        <Radio
                          value="false"
                          borderColor="var(--col-dark)"
                          _checked={{
                            borderColor: "var(--col-bright)",
                            bg: "var(--col-bright)",
                            color: "var(--col-dark)",
                            _before: {
                              content: '""',
                              display: "inline-block",
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              bg: "var(--col-dark)",
                            },
                          }}
                          _hover={{ bg: "var(--col-tertiary)" }}
                        >
                          No
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <HStack width="100%" spacing={4}>
                    <Button
                      bgColor="var(--col-secondary)"
                      color="white"
                      _hover={{
                        bg: "var(--col-tertiary)",
                        color: "var(--col-dark)",
                      }}
                      mt={2}
                      ml="auto"
                      onClick={handleSaveChanges}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme="red"
                      _hover={{ bg: "#ff8366", color: "var(--col-dark)" }}
                      mt={2}
                      ml="auto"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                    <Button
                      mt={2}
                      _hover={{
                        bg: "var(--col-tertiary)",
                        color: "var(--col-dark)",
                      }}
                      ml="auto"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </>
              ) : (
                <>
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Description:{" "}
                    </Text>
                    {ItemData.itemDesc}
                  </Box>
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Quantity:{" "}
                    </Text>
                    {ItemData.itemQuant}
                  </Box>
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Price (per item):{" "}
                    </Text>
                    {ItemData.itemPrice}
                  </Box>
                  {+ItemData.itemQuant > 1 && (
                    <Box>
                      <Text as="span" fontWeight="bold">{`Total price: `}</Text>
                      {+ItemData.itemPrice * +ItemData.itemQuant}
                    </Box>
                  )}
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Viewability:
                    </Text>{" "}
                    {ItemData.itemPub === "true" ? "Private" : "Public"}
                  </Box>
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Sharable:
                    </Text>{" "}
                    {ItemData.itemSharable === "true" ? "Yes" : "No"}
                  </Box>
                  <HStack width="100%">
                    <Button
                      bgColor="var(--col-secondary)"
                      color="white"
                      _hover={{
                        bg: "var(--col-tertiary)",
                        color: "var(--col-dark)",
                      }}
                      mt={4}
                      ml="auto"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Item
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default EditItem;
