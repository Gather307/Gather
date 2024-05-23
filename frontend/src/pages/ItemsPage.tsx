import React from "react";
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  VStack 
} from "@chakra-ui/react";
import { ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";
import ItemGroup from "../components/ItemGroup";
import { useNavigate } from "react-router-dom";

// Define the types for items
type Item = {
  name: string;
  description: string;
};

type Items = {
  School: Item[];
  Technology: Item[];
  Party: Item[];
};

const items: Items = {
  School: [
    { name: "Glue Stick", description: "The best glue stick I have ever used" },
    {
      name: "White Board",
      description:
        "I use this whiteboard to teach in Classroom Room Number 14 and this one is 5 feet by ...",
    },
    { name: "Markers", description: "N/A" },
  ],
  Technology: [
    { name: "Tablet", description: "Samsung Galaxy Tab 3" },
    { name: "Switch", description: "Nintendo Switch with 2 Joycons" },
    { name: "Mario Kart 8", description: "N/A" },
  ],
  Party: [],
};

const ItemsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGroupsClick = () => {
    navigate("/groups");
  };

  return (
    <Box w="100vw" p={4} bg="gray.100">
      <Flex direction="column" minH="100vh" width="full">
        <Box mb={4} width="full">
          <Heading as="h1" size="lg">
            Your Items
          </Heading>
          <Flex mt={2} alignItems="center">
            <Button
              leftIcon={<ArrowForwardIcon />}
              onClick={handleGroupsClick}
              colorScheme="teal"
              variant="solid"
              mr={4}
            >
              Switch to Groups
            </Button>
            <InputGroup width="300px">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                placeholder="Search for group"
                isDisabled
                _disabled={{
                  bg: "white",
                  color: "gray.500",
                  cursor: "not-allowed",
                }}
              />
            </InputGroup>
          </Flex>
        </Box>

        <VStack spacing={4} flex="1" align="stretch" width="full">
          {Object.keys(items).map((category) => (
            <ItemGroup
              key={category}
              category={category}
              items={items[category as keyof Items]}
            />
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default ItemsPage;
