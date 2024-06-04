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
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { fetchBasket } from "../../lib/fetches";
import {
  handleDeleteAllItemsInBasket,
  handleDeleteBasket,
  handleDeleteBasketFromGroup,
} from "../../lib/deletes";
import { editBasket } from "../../lib/edits";

//Add Radio for boolean
//Number input for number type

interface Props {
  basketId: string;
  groupId: string;
}

const EditBasket: React.FC<Props> = ({ basketId, groupId }) => {
  // Note: Colors not added yet, just basic structure
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [BasketData, setBasketData] = useState({
    basketId: "",
    basketName: "",
    basketDesc: "",
  });

  useEffect(() => {
    const fetchBasketData = async () => {
      try {
        const response = await fetchBasket(basketId);
        if (response.ok) {
          const data = await response.json();
          setBasketData({
            basketId: data.basketId,
            basketName: data.basketName,
            basketDesc: data.description,
          });
          setEditedName(data.basketName);
          setEditedDesc(data.description);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBasketData();
  }, [basketId]);

  const handleDelete = async (groupId: string, basketId: string) => {
    console.log("got here");
    console.log(groupId);
    console.log(basketId);
    try {
      // Wait for each asynchronous deletion to complete
      await handleDeleteBasketFromGroup(groupId, basketId);
      await handleDeleteAllItemsInBasket(basketId);
      await handleDeleteBasket(basketId);

      console.log("All deletions completed successfully");

      // Reload the page after all deletions are complete
      window.location.reload();
    } catch (error) {
      console.error("An error occurred while deleting:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBasket = {
        basketName: editedName,
        description: editedDesc,
      };
      console.log(updatedBasket);
      const response = await editBasket(basketId, updatedBasket);

      if (response.ok) {
        setBasketData((prev) => ({
          ...prev,
          basketName: updatedBasket.basketName,
          basketDesc: updatedBasket.description,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    window.location.reload();
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
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
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
          {BasketData.basketName}
        </PopoverHeader>
        <PopoverBody>
          <VStack alignItems="flex-left">
            <VStack alignItems="flex-start">
              {isEditing ? (
                <>
                  <FormControl>
                    <FormLabel fontWeight="bold">Basket Name</FormLabel>
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
                      onClick={() => handleDelete(groupId, basketId)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </>
              ) : (
                <>
                  <Box>
                    <Text as="span" fontWeight="bold">
                      Description:{" "}
                    </Text>
                    {BasketData.basketDesc}
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
                      Edit Basket
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

export default EditBasket;
