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
import {} from "@chakra-ui/react";

//Add Radio for boolean
//Number input for number type

interface Props {
  basketId: string;
}

const EditBasket: React.FC<Props> = ({ basketId }) => {
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
        const response = await fetch(
          `http://localhost:3001/baskets/${basketId}`,
        );
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/baskets/${basketId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log("Basket deleted successfully");
    } catch (error) {
      console.error("There was an error deleting the basket", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedBasket = {
        basketName: editedName,
        description: editedDesc,
      };
      console.log(updatedBasket);
      const response = await fetch(
        `http://localhost:3001/baskets/${basketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBasket),
        },
      );

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
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button 
        
        onClick={() => setIsEditing(true)}>Edit</Button>
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
