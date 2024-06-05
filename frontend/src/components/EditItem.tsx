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
import { EditIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import {} from "@chakra-ui/react";
import { fetchItem } from "../../lib/fetches";
import { editItem } from "../../lib/edits";

//Add Radio for boolean
//Number input for number type

interface Props {
  itemId: string;
  editable?: boolean;
}

// Component to edit and manage item details
const EditItem: React.FC<Props> = ({ itemId, editable = true }) => {
  // Note: Colors not added yet, just basic structure
  // State to handle editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State to handle editing name
  const [editedName, setEditedName] = useState("");
  // State to store edited item descriptions
  const [editedDesc, setEditedDesc] = useState("");
  // State to store edited item quantity
  const [editedQuant, setEditedQuant] = useState("");
  // State to store edited item price
  const [editedPrice, setEditedPrice] = useState("");
  // State to store edited item visibility
  const [editedPub, setEditedPub] = useState(false);
  // State to store edited item shareability
  const [editedSharable, setEditedSharable] = useState("");
  // State to store item data
  const [ItemData, setItemData] = useState({
    itemId: "",
    itemName: "",
    itemDesc: "",
    itemQuant: "",
    itemPrice: "",
    itemPub: false,
    itemSharable: "",
  });

  // Effect to fetch item data
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetchItem(itemId);
        if (response.ok) {
          const data = await response.json();
          setItemData({
            itemId: data.itemId,
            itemName: data.name,
            itemDesc: data.notes,
            itemQuant: data.quantity,
            itemPrice: data.price,
            itemPub: data.isPrivate === "true" || data.isPrivate === true,
            itemSharable: data.toShare,
          });
          setEditedName(data.name);
          setEditedDesc(data.notes);
          setEditedQuant(data.quantity);
          setEditedPrice(data.price);
          setEditedPub(data.isPrivate === "true" || data.isPrivate === true);
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

  // Format and parse functions for price input
  const format = (val: any) => `$` + val;
  const parse = (val: any) => val.replace(/^\$/, "");

  // Function to handle saving changes to the item
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
      const response = await editItem(itemId, updatedItem);

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
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Popover
      placement="auto"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
            altBoundary: true,
            padding: 8,
          },
        },
      ]}
    >
      <PopoverTrigger>
        <IconButton aria-label="More" icon={<EditIcon />} />
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
                    <RadioGroup
                      onChange={(val) => setEditedPub(val === "true")}
                      value={editedPub ? "true" : "false"}
                    >
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
                  <HStack
                    display={"flex"}
                    width="100%"
                    justifyContent="space-around"
                  >
                    <Button
                      bgColor="var(--col-secondary)"
                      color="white"
                      _hover={{
                        bg: "var(--col-tertiary)",
                        color: "var(--col-dark)",
                      }}
                      onClick={handleSaveChanges}
                    >
                      Save
                    </Button>
                    <Button
                      _hover={{
                        bg: "var(--col-tertiary)",
                        color: "var(--col-dark)",
                      }}
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
                    {ItemData.itemPub ? "Private" : "Public"}
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
                      display={editable ? "flex" : "none"}
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
