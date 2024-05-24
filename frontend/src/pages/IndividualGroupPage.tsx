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
} from "@chakra-ui/react";
import { IoArrowBack, IoSearch, IoAddCircleOutline, IoSettingsSharp } from "react-icons/io5";
//import "../styles/GroupPage.css";

export interface Group {
  groupName: string;
  _id: string;
  privateGroup: boolean;
  description: string;
  members: string[];
  baskets: string[];
  created: Date;
}

function IndividualGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
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
        bgGradient="linear(to-r, rgba(0,0,0,0) 10%, var(--col-secondary) 30%, var(--col-secondary) 70%, rgba(0,0,0,0) 90%)"
      >
        <Flex alignItems="center">
          <IconButton
            icon={<IoArrowBack />}
            aria-label="Go Back"
            onClick={() => navigate('/groups')}
            marginRight="10px"
          />
          <Button onClick={() => navigate('/groups')} variant="link" leftIcon={<IoArrowBack />}>
            Go Back
          </Button>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex
        flexDirection="column"
        padding="20px"
        flex="1"
        overflowY="auto"
      >
        {loading ? (
          <Box padding="20px">
            Loading...
          </Box>
        ) : group ? (
          <VStack align="stretch" spacing={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="lg" marginRight="10px">{group.groupName}</Heading>
              <InputGroup width="300px">
                <InputLeftElement pointerEvents="none" children={<IoSearch />} />
                <Input placeholder="Search in group" />
              </InputGroup>
              <HStack>
                <IconButton icon={<IoAddCircleOutline />} aria-label="Add" />
                <IconButton icon={<IoSettingsSharp />} aria-label="Settings" />
              </HStack>
            </Flex>
            <Flex justifyContent="space-between">
              <VStack align="start" spacing={4} flex="1">
                <Box>
                  <Heading size="md">Members</Heading>
                  <VStack align="start">
                    {group.members.map((member, index) => (
                      <Text key={index}>{member}</Text>
                    ))}
                  </VStack>
                </Box>
                <Box>
                  <Heading size="md">Created On</Heading>
                  <Text>{new Date(group.created).toLocaleDateString()}</Text>
                </Box>
                <Box mt={4}>
                  <Button as={Link} to={`/groups/edit/${group._id}`} colorScheme="teal" width="200px">
                    Edit Group
                  </Button>
                </Box>
              </VStack>
              <Box flex="3" paddingLeft="20px">
                <Heading size="md">Description</Heading>
                <Text fontSize="lg">{group.description || "No description given"}</Text>
              </Box>
            </Flex>
            <Box mt={8}>
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
          </VStack>
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
