import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
} from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
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
            as={Link}
            to="/groups"
            marginRight="10px"
          />
          <Heading color="var(--col-secondary)" fontWeight="300" fontSize="40px">
            Group Details
          </Heading>
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
            <Heading size="lg">{group.groupName}</Heading>
            <Text fontSize="lg">{group.description || "No description given"}</Text>
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
            <Button as={Link} to={`/groups/edit/${group._id}`} colorScheme="teal" width="200px" mt={4}>
              Edit Group
            </Button>
            <Box mt={8}>
              {/* Placeholder for Baskets component */}
              <Heading size="md">Baskets Component</Heading>
              <Text>This is where the Baskets component will be placed.</Text>
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
