import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
} from "@chakra-ui/react";
import { IoArrowBack, IoSearch, IoSettingsSharp } from "react-icons/io5";
import { IGroup } from "../../../backend/models/groupSchema";

function IndividualGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroup = () => {
    const promise = fetch(`http://localhost:3001/groups/${groupId}`);
    return promise;
  };

  useEffect(() => {
    fetchGroup()
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(`Terrible error occurred! ${err}`);
      });
  }, [groupId]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      backgroundColor="var(--col-bright)"
    >
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding="10px 20px"
        borderBottom="2px solid"
        borderColor="rgba(100, 100, 100, 0.8)"
        bgGradient="linear(t-b, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
      >
        <Button onClick={() => navigate('/groups')} variant="link" leftIcon={<IoArrowBack />}>
          Go Back
        </Button>
        <Flex alignItems="center">
          <InputGroup width="300px" marginRight="20px">
            <InputLeftElement pointerEvents="none" children={<IoSearch />} />
            <Input
              placeholder="Search in group"
              backgroundColor="rgba(255, 255, 255, 0.8)"
            />
          </InputGroup>
          <Button
            onClick={() => console.log('Send Invite clicked')}
            bg="teal"
            color="white"
            _hover={{ bg: "teal" }}
            marginRight="10px"
          >
            Send Invite
          </Button>
          <IconButton icon={<IoSettingsSharp />} aria-label="Settings" />
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex
        flexDirection="column"
        padding="20px"
        flex="1"
        overflowY="auto"
        alignItems="center"
      >
        {loading ? (
          <Box padding="20px">
            Loading...
          </Box>
        ) : group ? (
          <>
            <Box
              width="99%"
              padding="20px"
              borderWidth="1px"
              borderRadius="md"
              backgroundColor="rgba(255, 255, 255, 0.8)"
            >
              <VStack align="stretch" spacing={4}>
                <Flex justifyContent="center" alignItems="center" position="relative">
                  <Heading size="2xl" textAlign="center">{group.groupName}</Heading>
                  <Button
                    bg="gray.500"
                    color="white"
                    _hover={{ bg: "gray.500" }}
                    position="absolute"
                    right="0"
                  >
                    Edit Group
                  </Button>
                </Flex>
                <Divider marginY="20px" />
                <HStack spacing={4}>
                  <Box
                    padding="10px"
                    borderWidth="1px"
                    borderRadius="md"
                    flex="1"
                    backgroundColor="rgba(0, 0, 0, 0.05)"
                  >
                    <Heading size="md" marginBottom="10px">Members</Heading>
                    <VStack align="start">
                      {group.members.map((member, index) => (
                        <Text key={index}>{member}</Text>
                      ))}
                    </VStack>
                  </Box>
                  <Box
                    padding="10px"
                    borderWidth="1px"
                    borderRadius="md"
                    flex="1"
                    backgroundColor="rgba(0, 0, 0, 0.05)"
                  >
                    <Heading size="md" marginBottom="10px">Created On</Heading>
                    <Text>{new Date(group.created).toLocaleDateString()}</Text>
                  </Box>
                  <Box
                    padding="10px"
                    borderWidth="1px"
                    borderRadius="md"
                    flex="2"
                    backgroundColor="rgba(0, 0, 0, 0.05)"
                  >
                    <Heading size="md" marginBottom="10px">Description</Heading>
                    <Text fontSize="lg">{group.description || "No description given"}</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
            <Box mt={8} width="99%">
              <Heading size="md">Baskets Component</Heading>
              <Text mt={2}>This is where the Baskets component will be placed.</Text>
              <Box overflowY="auto" maxHeight="300px" mt={4}>
                {/* Replace with actual basket items */}
                <VStack spacing={4} align="stretch">
                  <Box padding="10px" borderWidth="1px" borderRadius="md">
                    Basket Item 1
                  </Box>
                  <Box padding="10px" borderWidth="1px" borderRadius="md">
                    Basket Item 2
                  </Box>
                  <Box padding="10px" borderWidth="1px" borderRadius="md">
                    Basket Item 3
                  </Box>
                </VStack>
              </Box>
            </Box>
          </>
        ) : (
          <Box padding="20px">
            <Text fontSize="lg">Group not found!</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default IndividualGroupPage;
